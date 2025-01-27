import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';

const RenderTotalAmount = () => {
  
    //isss baar cart slice se hai
  const {total,cart}= useSelector((state)=>state.cart);

  const handleBuyCourse= ()=>{
    const courses=cart.map((course)=>course._id);
    console.log("Bought these courses", courses);
    //Todo:Api integrate-> payment gateay tak le jayegi
  }
  
    return (
    <div>
        <p> total</p>
        <p> Rs {total}</p>
        <IconBtn
          text="Buy Now"
          onclick={handleBuyCourse}
          customClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount