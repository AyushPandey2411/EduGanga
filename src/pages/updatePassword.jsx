import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../components/common/Spinner';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operations/authApi';
import { AiOutlineEye ,AiOutlineEyeInvisible } from 'react-icons/ai';


const UpdatePassword = () => {

   //initialising dipatch
   const dispatch =useDispatch();
   const navigate = useNavigate();
    //initialising location to use for getting token
    const location = useLocation();
    const [formData, setFormData]= useState({
          password:"",
          confirmPassword:"",
    })
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]= useState(false);

    const { loading } = useSelector((state) => state.auth);

   
    //fetch password,confirm Password from data
    const {password,confirmPassword}= formData;
    const handleOnChange= (e)=>{
        setFormData((prevData)=>(
          {
            //use the prev data and update the particular field value we are interacting
            ...prevData,
            [e.target.name]:e.target.value,
          }
        ))
    }

    //function to dipatch
    const handleOnSubmit =(e)=>{
         e.preventDefault();
         const token=location.pathname.split("/").at(-1);
         //reset password for calling backend
         dispatch(resetPassword(password,confirmPassword,token,navigate))
    }
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 text-richblack-5">
        {loading ? (
          <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
        ) : (
          <div className="max-w-[500px] p-4 lg:p-8 bg-richblack-900 rounded-md">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem]">
              Choose new Password
            </h1>
            <p className="my-4 text-[1.125rem] leading-[1.625rem]">
              Almost done. Enter your new password and you&apos;re all set.
            </p>
            <form onSubmit={handleOnSubmit}>
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  New Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter Password"
                  className="form-style w-full !pr-10 p-2 rounded bg-richblack-700 text-white"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
              <label className="relative mt-3 block">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  Confirm New Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                  className="form-style w-full !pr-10 p-2 rounded bg-richblack-700 text-white"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiFillEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
  
              <button
                type="submit"
                className="mt-6 w-full rounded-[8px] bg-yellow-100 py-[12px] px-[12px] font-semibold text-richblack-900"
              >
                Reset Password
              </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
              <Link to="/login">
                <p className="flex items-center gap-x-2 text-richblack-5">
                  <FaArrowLeft/> Back To Login
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
}

export default UpdatePassword
