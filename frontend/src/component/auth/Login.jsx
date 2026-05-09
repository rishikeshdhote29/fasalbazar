import React, { useEffect, useState } from 'react';
import{ useDispatch, useSelector} from 'react-redux'
import {loginAction, sellerLoginAction} from '../../redux/userSlice.js';
import Success from "../utils/Success.jsx"
import ErrorMsg from "../utils/ErrorMsg.jsx";
import {useNavigate} from "react-router";
const Login = () => {
	const dispatch= useDispatch();
	 const navigate = useNavigate();
const [formData,setFormData]= useState({
	
	email:"",
	password:"",
})
const [userType,setUser]=useState("");
const {loading,success,error,isLoggedIn}= useSelector(state => state.Users)



const handleUser=(e)=>{
 setUser(e.target.value)
}
const handleOnChange=(e) =>{
	setFormData((preVal)=>({
		...preVal,
		[e.target.name]:e.target.value
	}))

}
const 	 handleSubmit=(e)=>{
		 e.preventDefault();
		 console.log("user type",userType);
	if(userType==="buyer")
		dispatch(loginAction(formData));
	else
		dispatch(sellerLoginAction(formData));

	
	
	}

	 useEffect(() => {
		  if (isLoggedIn) {
      navigate("/");
    }
		  }, [isLoggedIn, navigate]);


	return (
		 
		
		
		<div className='h-screen bg-linear-to-r/shorter from-indigo-500 to-teal-400'>
			{success && <Success message="LogdedIn Successful!" />}
			{error&& <ErrorMsg  />}
			
			<div className='items-center pt-10'>
				<div className="w-full max-w-md mx-auto  p-6 bg-white rounded-lg shadow-md">
			<div  >	<h2  className='mb-4 text-2xl md:text-3xl font-bold text-coolGray-900 text-center '>Login </h2></div>
			 <form action="post" onSubmit={handleSubmit}>
				<div className=' flex gap-7  justify-center item-center w-full'>
				{/* <div><input value className=' gap px-2  rounded-sm bg-green-500 hover:bg-green-600 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:bg-green-700 '>Farmer</input></div>
				<div><input className=' gap px-2 rounded-sm bg-green-500 hover:bg-green-600 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:bg-green-700 '>Buyer</input></div> */}
			  <label>
            <input type="radio" onClick={handleUser} name="user" value="buyer" required />
           Buyer 
        </label>
		 <label>
            <input type="radio"  onClick={handleUser} name="user" value="seller" />
			Seller/Farmer
        </label>
			  
			 </div>
			<div className=' mt-7 grid  justify-center item-center w-full'>
				
				
				
				<input type="email" name="email" value={formData.email} onChange={handleOnChange} required placeholder='Email' className=' border ps-2 py-1  w-2xs m-4 justify-center items-center border-color-green rounded-sm'/>
				
				<input type="password" name="password" value={formData.password} onChange={handleOnChange}  required placeholder='Password' className='ps-2  border  py-1 w-2xs  m-4 justify-center item-cente border-color-green rounded-sm'/>
				<a  className="ms-4 text-blue-500" href="/forget-password">Forget Password</a>
				<button  className='w-2xs m-4 mt-2 p-1 rounded-sm bg-green-500 hover:bg-green-700 ' >{loading?"Login....":"Login"}</button>
			</div>

			 </form>
			
			</div>
			</div>
		</div>
	);
};

export default Login;