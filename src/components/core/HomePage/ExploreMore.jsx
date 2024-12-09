import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore ';
import HighlightText from "./HighlightText"
import CourseCard from './CourseCard';

const tabsName=[
      "Free",
      "New to Coding",
      "Most popular",
      "Skill paths",
      "Career paths"
];

const ExploreMore = () => {

   const [currentTab,setCurrentTab]=useState(tabsName[0])  //Free at 0 th index will be default value of current tab
   const [courses,setCourses]=useState(HomePageExplore[0].courses);  //have fetched data for 3 cards ,starting with 0th index-free 
   const [currentCard,setCurrentCard]= useState(HomePageExplore[0].courses[0].heading);

   //function for changing current tab values
   const setMyCard= (value) =>{
        setCurrentTab(value);
        const result=HomePageExplore.filter((course)=>course.tag === value); //find new tab according to value
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
   }

  return (
    <div>
        <div className=' text-4xl font-semibold text-center'>
          Unlock the 
          <HighlightText text={"Power of Code"}/>
        </div>

        <p className=' text-center text-richblack-300 text-sm text-[16px] mt-3 '>
          Learn to build anything You can imagine
        </p>

        {/* Tab creation  */}

        <div className=' flex flex-row rounded-full bg-richblack-800 mb-5 mt-5 border-richblack-100 px-1 py-1'>
          {
            tabsName.map((element,index)=>{
                  return (
                     <div className={`text-[16px] flex flex-row items-center gap-2 
                          ${currentTab === element 
                          ? " bg-richblack-900 text-richblack-5 font-medium"
                          :" text-richblack-200 "} 
                          rounded-full transition-all duration-200 cursor-pointer 
                          hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                          key={index}
                          onClick={()=> setMyCard(element)}
                          >
                         {element}
                     </div>
                  )
            })
          }
        </div>

        <div className=' lg:h-[150px]'></div>

        {/* Group of course cards */}

        <div  className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3 ">
          {
             courses.map((element,index)=>{
                  return (
                      <CourseCard 
                        key={index}
                        cardData= {element}
                        currentCard={currentCard}
                        setCurrentCard={setCurrentCard}
                      />
             )
             })
          }
        </div>

    </div>
  )
}

export default ExploreMore
