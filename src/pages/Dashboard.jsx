import React from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../components/common/Spinner';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {

  //getting both loading data using UseSelector hook
  const {loading: authLoading} = useSelector((state)=>state.auth);
  const {loading: profileLoading} = useSelector((state)=>state.profile);

  if(profileLoading || authLoading)
  {
    return (
        <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
    )
  }



  return (
    <div className=' relative flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] '>
      <Sidebar className="h-1/4 md:h-[calc(100vh-3.5rem)]" />  
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
         <div  className="mx-auto w-11/12 max-w-[1000px] py-10">
            <Outlet/>
         </div>
      </div>   
    </div>
  )
}

export default Dashboard
