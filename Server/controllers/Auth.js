const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile = require('../models/Profile')
const otpGenerator=require("otp-generator");
const mailSender = require("../utils/mailSender")
const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");
require("dotenv").config();
const { passwordUpdated } = require("../mail/templates/passwordUpdate")


//---------- sendOTP
exports.sendOTP=async(req,res)=>{

    try {
        
    //fetch email from request ki body:
    const {email}=req.body;

    //check if user already exist
    const checkUserPresent=await User.findOne({email});

    //if user already exist ,then return a response
    if(checkUserPresent)
    {
        return res.status(401).json({
            success:false,
            message:"User already registered",
        })
    }
     //generate OTP
     var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
     });
     console.log("OTP generated: ",otp);

     //ensuring uniqueness of otp:
     let result=await OTP.findOne({otp:otp});

     //if not unique -generating other OTP 
     //-----can make this process better by using some packages which are provided in companies
     while(result)
     {
        otp=otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
         })
        result=await OTP.findOne({otp:otp});
     }
 
     //creating OTP object:
     const otpPayload= {email,otp};

     //create an entry for otp
     const otpBody=await OTP.create(otpPayload);
     console.log(otpBody);

     //return response successfully
     res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp,
     })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    
}

//email validation can also be added for otp


//-----sign up----

exports.signUp=async(req,res)=>{
    try {
        //data fetch from request's body
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;  //we have missed confirmPassword,contactnumber--till now(in models)
    
    //validation

    if(!firstName || !lastName || !email || !password || !confirmPassword
        || !otp)
    {
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }


    //match 2 passwords
    if(password!==confirmPassword)
    {
        return res.status(400).json({
            success:false,
            message:"Password and ConfirmPassword does not match ,please try again",
        });
    }

    //check if user already exist or not--through DB call
    const existingUser=await User.findOne({email});

    if(existingUser)
    {
        return res.status(400).json({
            success:false,
            message:"User already registered",
        });
    }

    //find most recent OTP stored for user
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);

    console.log(recentOtp);
 
    //validate OTP
    if(recentOtp.length==0)
    {
        //OTP not found
        return res.status(400).json({
            success:false,
            message:"OTP not found",
        })
    }
    else if(otp !==recentOtp[0].otp)
    {
        //invalid Otp
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        });
    }
    

    //Hash Password

    const hashedPassword=await bcrypt.hash(password,10);

    //creating profile to add in additional details
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })

    //entry create in DB
    const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    
    //return res
    return res.status(200).json({
        success:true,
        message:"User is registered successfully",
        user,
    });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be registered,Please try again",
        })
    }
    
}



//----- login ------

exports.login=async(req,res)=>{
    try {
        
       //get data from req body
       const {email,password}=req.body;

       //validation data
       if(!email || !password)
       {
          return res.status(403).json({
            success:false,
            message:"All fields are required,please try again",
          });
       }

       //user check exist or not
       const user=await User.findOne({email}).populate("additionalDetails");//populate not needed

       if(!user)
       {
        return res.status(401).json({
            success:false,
            message:"User is not registered,please signup first",
        });
       }
       
       //generate JWT,after password matching
       if(await bcrypt.compare(password,user.password))
       {

         const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
         }

          const token=jwt.sign(payload,process.env.JWT_SECRET,
            { expiresIn:"2h",
            });
            
        user.token=token;//issi pe 20 min lagaye the
        user.password=undefined;

        //create cookie and send response
        
        const options={
            expires:new Date(Date.now()+3*24*60*60*100),
            httpOnly:true,
        }
        
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully",
        })
        
       }

       else{
          return res.status(401).json({
            success:false,
            message:"Password is incorrect",
          });
       }

       //create cookie and send response

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure"
        })
    }
}



//changePassword------ to be written by ourself
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
      
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
      
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }

