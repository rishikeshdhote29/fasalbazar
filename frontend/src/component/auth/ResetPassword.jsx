import React, { useState } from 'react';
import {forgetPasswordAction, resetPasswordAction, resetSellerPasswordAction} from "../../redux/userSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import Success from "../utils/Success.jsx";
import ErrorMsg from "../utils/ErrorMsg.jsx";

const ResetPassword = () => {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const {success,error}= useSelector(state => state.Users)
const [userType,setUserType]= useState("");
  const dispach= useDispatch();
    const { token } = useParams();
console.log("token",token);
  function handleSubmit(e) {
    e.preventDefault();
    if(password1 !== password2) {
        alert("Passwords do not match!");
        
    }else
      
      if (userType==="buyer")
   
dispach(resetPasswordAction({password:password1,token:token}))
    else
      dispach(resetSellerPasswordAction({password:password1,token:token}))
  
  }
  
  function handleUser() {
    setUserType(e.target.value)
    
  }
  
  return (
    <div className="flex mt-5 justify-center items-center">
      {success && <Success/>}
			{error&& <ErrorMsg  />}
      
      <div className="w-full justify-center max-w-4xl">
        <p className="font-bold text-3xl text-center">Forget Password</p>
        <div className="flex justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md">
            <form onSubmit={handleSubmit}>
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
             < label className="text-lg font-medium">Enter your new password:</label>
              <input
                type="password"
                placeholder="password"
                className="border mt-4 p-2 rounded"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
              <br/>
           < label className="text-lg font-medium">Confirm your new password:</label>
            <input
                type="password"
                placeholder="confirm password"
                className="border mt-4 p-2 rounded"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              /> <br/>
              <button className="bg-blue-500 mt-4 text-white p-2 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
