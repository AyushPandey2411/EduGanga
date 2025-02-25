import React, { useState } from 'react'
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from '../../../services/operations/authApi'
import Spinner from '../../common/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from "../../common/ConfirmationModal"

const Sidebar = () => {

    const {loading: authLoading} = useSelector((state)=>state.auth);
    const {user,loading: profileLoading} = useSelector((state)=>state.profile);
    const dispatch=useDispatch();
    const navigate= useNavigate();
    //to keep track of confirmation modal
    const [confirmationModal,setConfirmationModal]=useState(null);


    //loader
    if(profileLoading || authLoading)
    {
      return (
          <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
      )
    }

   

  return (
    <div>
      <div className='flex h-[calc(45vh-3.5rem)] md:h-[calc(100vh-3.5rem)]  min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>
          
           <div className=' flex flex-col'>
               {
                 sidebarLinks.map((link)=>{
                    //conditional rendering:
                    if(link.type && user?.accountType !== link.type)
                        return null;
                    return(
                        <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                    )
                 })
               }
           </div>

           {/* horizontal line */}
           <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'>
           </div>

           {/* setting */}
           <div className=' flex flex-col'>
                <SidebarLink
                  link={{name:"Settings", path:"/dashboard/settings"}}
                  iconName="VscSettingsGear"
                />
              
              {/* logout    */}
               <button onClick={ ()=>
                setConfirmationModal(
                {
                 text1:"Are you Sure ?",
                 text2:"You will be logged out of your account",
                 btn1Text:"Logout",
                 btn2Text:"Cancel",
                 btn1Handler:()=>dispatch(logout(navigate)),
                 btn2Handler: ()=>setConfirmationModal(null),
                })}

                className=' px-8 py-2 text-sm font-medium text-richblack-300'
                >

                <div className=' flex items-center gap-x-2'>
                   <VscSignOut className=' text-lg'/>
                   <span>Logout</span>
                </div>


                </button>

           </div>  
           
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar
