import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { thumbnail: ThumbnailImage, price: CurrentPrice, _id: courseId } = course;

  const handleShare = () => {

    //using copy to clipboard package
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <>
      <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-full object-cover rounded-2xl"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="bg-yellow-100 p-2 font-bold rounded-md text-black"
              onClick={
                user && course?.studentsEnrolled?.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled?.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            
            {/* if student is not enrolled then show add to cart */}
            
            {(!user || !course?.studentsEnrolled?.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="bg-richblack-800 p-2 font-bold rounded-md w-full">
                Add to Cart
              </button>
            )}

          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={`my-2 text-xl font-semibold`}>
            This Course Includes :
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              
              {/* showing instructions */}
              {course?.instructions?.map((item, i) => {
                return (
                    //map function so using key
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 w-full"
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;