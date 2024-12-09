  import React, { useEffect, useState } from 'react'
  import { useForm } from 'react-hook-form';
  import { apiConnector } from "../../services/apiconnector"
  import { contactusEndpoint } from "../../services/apis";
  import CountryCode from "../../data/countrycode.json"
  import toast from 'react-hot-toast';
  
  const ContactUsForm = () => {

    const[loading,setLoading]= useState(false);
    const{
      register,
      handleSubmit,reset,
      formState:{errors, isSubmitSuccessfull}}
      = useForm();
    
      const submitContactForm= async(data)=>{
        console.log("Logging Data ",data);
        //have to call api for contact us controller
        try {
          //till api is called ,loading karna hai
          setLoading(true);
          const response= await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
          // const response={status:"Ok"}
          console.log("logging response",response);
          setLoading(false);
          toast.success(response.data.message);
        } catch (error) {
          console.log("Error:",error.message);
          setLoading(false);
        }
      }

      useEffect(()=>{
        if(isSubmitSuccessfull){
          reset({
            email:"",
            firstname:"",
            lastname:"",
            message:"",
            phoneNo:""
          })
        }
      },[reset, isSubmitSuccessfull])


    return (
      <form
      className="flex flex-col gap-4 p-6 bg-gray-900 text-white rounded-lg shadow-lg "
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-1/2">
          <label htmlFor="firstname" className="text-gray-400">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter First Name"
            className="shadow-sm shadow-white bg-gray-800 text-white bg-richblack-600 placeholder-gray-500 rounded-md p-2"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-yellow-100 text-sm">
              Please enter your first name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-1/2 ">
          <label htmlFor="lastname" className="text-gray-400">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter Last Name"
            className="shadow-sm shadow-white  bg-richblack-600 text-white placeholder-gray-500 rounded-md p-2"
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-gray-400">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email Address"
          className="shadow-sm shadow-white bg-richblack-600 text-white placeholder-gray-500 rounded-md p-2"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-yellow-100 text-sm">
            Please enter your email address.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-gray-400">
          Phone Number <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-4 ">
          <select
            name="countrycode"
            id="countrycode"
            className="shadow-sm shadow-white bg-richblack-600 text-white placeholder-gray-500 rounded-md p-2 w-1/6"
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((ele, i) => (
              <option key={i} value={ele.code}>
                {ele.code}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="phonenumber"
            id="phonenumber"
            placeholder="12345 67890"
            className="shadow-sm shadow-white bg-richblack-600 text-white placeholder-gray-500 rounded-md p-2 flex-grow"
            {...register("phoneNo", {
              required: {
                value: true,
                message: "Please enter your phone number.",
              },
              maxLength: { value: 12, message: "Invalid phone number" },
              minLength: { value: 10, message: "Invalid phone number" },
            })}
          />
        </div>
        {errors.phoneNo && (
          <span className="text-yellow-100 text-sm">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-gray-400">
          Message <span className=" text-red-500 ">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="4"
          placeholder="Enter your message here"
          className="shadow-sm shadow-white bg-richblack-600  text-white placeholder-gray-500 rounded-md p-2"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="text-yellow-100 text-sm">
            Please enter your message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`bg-yellow-100 text-black font-bold py-2 px-4 rounded-md transition-all duration-200 hover:scale-95 ${
          loading ? "opacity-50" : ""
        }`}
      >
        Send Message
      </button>
    </form>
    )
  }

  export default ContactUsForm
