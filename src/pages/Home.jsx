import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLineSection from "../components/core/HomePage/TimeLineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';


const Home = () => {
  return (
    <div>
      {/* section 1 */}

      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between '>
        <Link to={"/signup"}>
          <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
              <div className=' flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900 '>
                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
          </div>
        
        
        </Link>
      
      <div className=' text-center text-4xl font-semibold mt-7'>
        Empower your future with 
        <HighlightText text={"Coding Skills"}/>
      </div>

      <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
      With our online coding courses, you can learn at your own pace, from
      anywhere in the world, and get access to a wealth of resources,
      including hands-on projects, quizzes, and personalized feedback from
      instructors.
      </div>

      <div className=' flex flex-row gap-7 mt-8'>
           <CTAButton active={true} linkto={"/signup"}>
                Learn More
           </CTAButton>

           <CTAButton active={false} linkto={"/login"}>
               Book a Demo
           </CTAButton>
      </div>
             {/* Video */}
           <div className=' mx-3 my-12  shadow-blue-200'>
               <video muted loop autoPlay className="w-full max-w-screen-lg shadow-[20px_20px_rgba(25,255,255,0.75)]">
                  <source src={Banner} type='video/mp4'/>
               </video>
           </div>

          {/* Code Section 1  */}
          <div>
            <CodeBlocks 
            position={"lg:flex-row"}
            heading={
                <div className='text-4xl font-semibold'>
                  Unlock your 
                  <HighlightText text={"coding potential"}/>
                  with our online courses
                </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={
              {
                btnText:"try it yourself",
                linkto:"/signup",
                active:true,
              }
            }
            ctabtn2={
              {
                btnText:"Learn more",
                linkto:"/login",
                active:false,
              }
            }
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
           />
          </div>

          {/* Code Section-2 */}
                 
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse flex-col"}
            heading={
              <div className="w-[100%] lg:text-4xl text-3xl font-semibold lg:w-[50%]">
                Start {" "}
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

            <ExploreMore/>
      </div>

      {/* section 2 */}

      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg  h-[160px] lg:h-[310px]'> 
        {/* homepage_bg defined in app.css */}
           <div className=' w-11/12 max-w-maxContent flex flex-col items-center  gap-5  justify-between mx-auto'>
               <div className='h-[150px]'></div>
               <div className='flex flex-row gap-7 text-white'>
                 <CTAButton active={true} linkto={"/signup"}>
                      <div className=' flex items-center gap-3'>
                        Explore full Catalog
                      <FaArrowRight/>
                      </div>
                 </CTAButton>

                 <CTAButton active={false} linkto={"/signup"}>
                    <div>
                      Learn more
                    </div>
                 </CTAButton>
               </div>
           </div>
        </div>

        <div className=' w-11/12 max-w-maxContent flex flex-col items-center  gap-7  justify-between mx-auto'>
           
           <div className=' flex flex-row gap-5 mb-10 mt-[95px]'>
               <div className=' text-4xl font-semibold w-[45%]'>
                  Get the Skills you need for a
                  <HighlightText text={"Job that is in demand"}/> 
               </div>
               <div className=' flex flex-col gap-10 w-[40%] items-start'>
               <div>
               The modern EduGanga is the dictates its own terms. 
               Today, to be a competitive specialist requires more than professional skills.
               </div>
               <CTAButton active={true} linkto={"/signup"}>
                  <div>
                    Learn more
                  </div>
               </CTAButton>
           </div>

           </div>
  
           <TimeLineSection/>
           <LearningLanguageSection/>

        </div>

       
      </div>

      {/* section 3 */}
        <div className=' w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

           <InstructorSection/>

           <h2 className=' text-center text-4xl font-semibold mt-10'>review from Other Learners</h2>
           
           {/* Review Slider here */}
           <ReviewSlider/>
        </div>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Home