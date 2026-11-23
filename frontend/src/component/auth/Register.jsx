import React, { useEffect, useState } from 'react';
import{ useDispatch, useSelector} from 'react-redux'
import { registerAction,sellerRegisterAction } from '../../redux/userSlice.js';
import Success from "../utils/Success.jsx"
const Register = () => {
	const dispatch= useDispatch();
const [formData,setFormData]= useState({
	name:'',
	email:"",
	password:"",
})
const [user,setUser]=useState("");
const {loading,success}= useSelector(state => state.Users)



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
	if(user==="farmer")
		dispatch(sellerRegisterAction(formData));
	else
		dispatch(registerAction(formData));

	
	}

	return (
		 
		
		
		<div className='h-screen bg-linear-to-r/shorter from-indigo-500 to-teal-400'>
			{success && <Success message="Registration Successful!" />}
			<div className='items-center pt-10'>
				<div className="w-full max-w-md mx-auto  p-6 bg-white rounded-lg shadow-md">
			<div  >	<h2  className='mb-4 text-2xl md:text-3xl font-bold text-coolGray-900 text-center '>Register </h2></div>
			 <form action="post" onSubmit={handleSubmit}>
				<div className=' flex gap-7  justify-center item-center w-full'>
				{/* <div><input value className=' gap px-2  rounded-sm bg-green-500 hover:bg-green-600 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:bg-green-700 '>Farmer</input></div>
				<div><input className=' gap px-2 rounded-sm bg-green-500 hover:bg-green-600 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:bg-green-700 '>Buyer</input></div> */}
			  <label>
            <input type="radio" onClick={handleUser} name="user" value="buyer"  />
           Buyer 
        </label>
		 <label>
            <input type="radio"  onClick={handleUser} name="user" value="seller" />
			Seller/Farmer
        </label>
			  
			 </div>
			<div className=' mt-7 grid  justify-center item-center w-full'>
				
				
				<input type="text" name="name" value={formData.name} onChange={handleOnChange} required placeholder='Enter Your Name' className=' ps-2  w-2xs border  m-4 py-1 justify-center item-cente border-color-green rounded-sm'/>
				
				<input type="email" name="email" value={formData.email} onChange={handleOnChange} required placeholder='Email' className=' border ps-2 py-1  w-2xs m-4 justify-center item-cente border-color-green rounded-sm'/>
				<input type="password" name="password" value={formData.password} onChange={handleOnChange} required placeholder='Password' className='ps-2  border  py-1 w-2xs  m-4 justify-center item-cente border-color-green rounded-sm'/>
				<button  className='w-2xs m-4 mt-2 p-1 rounded-sm bg-green-500 hover:bg-green-700 ' >{loading?"Registring":"Register"}</button>
			</div>

			 </form>
			
			</div>
			</div>
		</div>
	);
};

export default Register;