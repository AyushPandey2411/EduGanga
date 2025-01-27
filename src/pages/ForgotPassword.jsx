import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authApi';
import Spinner from '../components/common/Spinner';
import { FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {

    
    //flag
    const [emailSent, setEmailSent]= useState(false);
    //email store--- check email page mein email id print ho rhi hai
    const [email,setEmail]= useState("")

    const {loading}= useSelector((state)=>state.auth);

    const dispatch=useDispatch();

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))
    }

    return (
    <div className=' text-white flex justify-center items-center min-h-screen'>
      {
        loading ? (
            <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
        ):(
          <div className=' bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md'>
            {/* have to show either reset password page or check your email page */}
            <h1 className=' text-2xl mb-4'>
                {
                    !emailSent ? "Reset Your Password":"Check Your email"
                }
            </h1>
            <p className=' mb-6'>
            {!emailSent
                            ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery."
                            : `We have sent the reset email to ${email}`}
            </p>

            <form onSubmit={handleOnSubmit}>
            {!emailSent && (
                            <label htmlFor="email" className="block mb-4">
                                <span className="block text-sm font-medium mb-2">Email Address:</span>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter Your Email Address'
                                    className="w-full px-3 py-2 bg-richblack-700 text-white  rounded focus:outline-none focus:ring-2 focus: ring-richblack-200"
                                />
                            </label>
                        )}
                <button type='submit'  className="w-full py-2 bg-yellow-100 text-black rounded hover:bg-yellow-200 transition-colors duration-200">
                    {
                        !emailSent ? "Reset Password" :"Resend Email"
                    }
                </button>
            </form>
            <div className=' mt-6'>
                <Link to="/login" className="text-white flex flex-row items-center gap-2  ">
                   <FaArrowLeft/>
                   <p>Back To Login</p>
                </Link>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ForgotPassword
