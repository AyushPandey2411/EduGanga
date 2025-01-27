import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/openRoute";
import Login from "./pages/Login"
import Signup from "./pages/SignUp"
import UpdatePassword from "./pages/updatePassword";
import VerifyEmail from "./pages/verifyEmail";

import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "../src/pages/Error"
import Settings from "../src/components/core/Dashboard/Settings"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from './utils/constants';
import { useSelector } from "react-redux";
import MyCourses from './components/core/Dashboard/MyCourses';
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Contact from "./pages/Contact";

function App() {

  const { user } = useSelector((state) => state.profile)

  return (
  <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/login' element={<OpenRoute><Login /></OpenRoute>} />
        <Route path='/signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='/forgot-password' element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path='/update-password/:id' element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path='/verify-email' element={<OpenRoute><VerifyEmail/></OpenRoute>} />
        <Route path='/about' element={<About/>} />
        <Route path='catalog/:catalogName' element={<Catalog/>} />
        <Route path='courses/:courseId' element={<CourseDetails/>} />
        <Route path='/contact' element={  <Contact />} />

        <Route
          element=
          {<PrivateRoute>
            <Dashboard />
          </PrivateRoute>}>

          <Route path='dashboard/my-profile' element={<MyProfile />} />

          <Route path='dashboard/Settings' element={<Settings/>} />
         
          {
          user?.accountType===ACCOUNT_TYPE.STUDENT &&(
            <>
             <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="dashboard/cart" element={<Cart />} />
            </>
          )
          }

       {
          user?.accountType===ACCOUNT_TYPE.INSTRUCTOR &&(
            <>
             <Route path="dashboard/add-course" element={<AddCourse/>} />
             <Route path="dashboard/my-courses" element={<MyCourses />} />
             <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />
             <Route path='dashboard/instructor' element={<Instructor />} />
            </>
          )
        }

     <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>
      }>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
          </>
        )
      }

      </Route>



         <Route path="*" element={<Error/>}/>
        
        </Route>
     </Routes>
  </div>
  );
}

export default App;
