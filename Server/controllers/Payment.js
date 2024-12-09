const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");

const mailSender=require("../utils/mailSender");
const { courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSucessEmail")
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/courseProgress");

//doing again for multiple course purchase---->using 'for loop'

//initiate the razorpay order

exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    const userId = req.user.id

    //haven't any course id
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
    }


    let total_amount = 0;//calculating total amount

    for (const course_id of courses) {
        let course
        try {
            // Find the course by its ID
            course = await Course.findById(course_id)


            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" })
            }

            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId)
            if (course.studentEnrolled.includes(uid)) {
                return res
                    .status(500)
                    .json({ success: false, message: "Student is already Enrolled" })
            }


            // Add the price of the course to the total amount
            total_amount += course.price



        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }

    }



    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    //order create
    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        res.json({
            success: true,
            data: paymentResponse,
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({ success: false, message: "Could not initiate order." })
    }
}

//verify the payment through signature
exports.verifyPayment = async (req, res) => {
    //fetching inputs required
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses

    const userId = req.user.id

    //validating
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
    }

    //----following steps are defined ---- for razorpay -not very much logical
    
    //pipe operator add
    let body = razorpay_order_id + "|" + razorpay_payment_id

    //getting expected signature
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        //function neeche hai
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}

//validation
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })

        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }


  exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
    
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
        //student ko dhundho
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }



 
  




// //capture the payment and initiate the razorpay order
// exports.capturePayment=async(req,res)=>{
//       //get courseID and userId
//       const {course_id}=req.body;
//       const userId=req.user.id;
//       //validation
//       //valid course Id
//       if(!course_id)
//       {
//         return res.json({
//             success:false,
//             message:"Please provide valid course ID",
//         })
//       };
//       //valid course Detail
//       let course;
//       try {
//         course=await Course.findById(course_id);
//         if(!course)
//         {
//             return res.json({
//                 success:false,
//                 message:"Could not find the course",
//             })
//         }
//         //user already pay for the same course
//         const uid=new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid))
//         {
//             return res.status(200).json({
//                 success:false,
//                 message:"User is already registered",
//             });
//         }
//       } catch (error) {
//            console.log(error);
//            return res.status(500).json({
//             success:false,
//             message:error.message,
//            });
//       }
      
//       //order create
//       const amount=course.price;
//       const currency="INR";

//       const options={
//         amount:amount*100,
//         currency,
//         //optionals:
//         receipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_id,
//             userId
//         }
//       }

//     //   function for order creation
//     try {
//         //initiate the payment using razorpay
//         const paymentResponse=await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         })
//     } catch (error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         })
//     }
     
// };

// //verify signature Of Razorpay and Server
// exports.verifySignature=async(req,res)=>{
//     const webhookSecret="12345678";

//     const signature=req.headers("x-razorpay-signature");

//     const shashum=crypto.createHmac("sha256",webhookSecret);
//     shashum.update(JSON.stringify(req.body));
//     const digest=shashum.digest("hex");

//     //matching
//     if(signature==digest)
//     {
//         console.log("payment is authorized");

//         const{courseId,userId}=req.body.payload.payment.entity.notes;

//         try {
//             //fulfill the action

//             //find the course and enroll the student in it
//             const enrolledCourse=await Course.findOneAndUpdate(
//                                           {_id:courseId},
//                                           {$push:{studentEnrolled:userId}},
//                                           {new:true},      
//             );

//             if(!enrolledCourse)
//             {
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course not found",
//                 })

//             }
//           console.log(enrolledCourse);
          
//           //find the student and add the course to their list of enrolled course
//         const enrolledStudent=await User.findOneAndUpdate(
//                                         {_id:userId},
//                                         {$push:{courses:courseId}},
//                                         {new:true}
//         );
         
//         console.log(enrolledStudent);

//         //sending confirmation email
//         const emailResponse=await mailSender(
//                                     enrolledStudent.email,
//                                     //Just Random Now
//                                     "Congratulations from CodeHelp",
//                                     "You are onboarded into the new Course",

//         );
//         console.log(emailResponse);

//         return res.status(200).json({
//             success:true,
//             message:"Signature verified and Course added",
//         });




//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//         else{
//               return res.status(400).json({
//                 success:false,
//                 message:"Invalid Request",
//               })
//         };
        


//     }





