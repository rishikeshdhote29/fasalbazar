import React, { useState } from 'react';
import {forgetPasswordAction, forgetSellerPasswordAction} from "../../redux/userSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import success from "../utils/Success.jsx";
import Success from "../utils/Success.jsx";
import ErrorMsg from "../utils/ErrorMsg.jsx";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate= useNavigate();
const dispach= useDispatch();
const [userType,setUserType]= useState("")
const {success,error}= useSelector(state => state.Users)
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Email submitted:", email);
    if(userType==="buyer")
dispach(forgetPasswordAction({email}))
    else
dispach(forgetSellerPasswordAction({email}))
  
  }
  
  function handleUser(e) {
        setUserType(e.target.value)
  }
  
  return (
    <div className="flex mt-5 justify-center items-center">
            {success && <Success/>}
      
			{error&& <ErrorMsg  />}
      

      <div className="w-full justify-center max-w-4xl">
        <p className="font-bold text-3xl text-center">Forget Password</p>
        <div className="flex justify-center">
          <div className="flex flex-col gap-4 mt-5 w-full max-w-md">
            <form onSubmit={handleSubmit } className={"flex flex-col gap-4 w-full"}>
             <div className={"flex gap-7  justify-center item-center w-full"}>
                 <label>
            <input type="radio" onClick={handleUser} name="user" value="buyer" required />
           Buyer
        </label>
		 <label>
            <input type="radio"  onClick={handleUser} name="user" value="seller" />
			Seller/Farmer
        </label>
             </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="bg-blue-500 text-white p-2 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
