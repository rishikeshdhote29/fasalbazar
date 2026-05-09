import React, {useRef} from 'react';
import { useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateProfileAction, updateSellerProfileAction} from "../../redux/userSlice.js";
import {useNavigate} from "react-router";
import Success from "../utils/Success.jsx";
const UpdateProfile = () => {
	const user =useSelector(state => state.Users.loggedinUser);
	  const fileInputRef = useRef(null);

const dispatch = useDispatch();
const navigate= useNavigate();
const {success}= useSelector(state => state.Users)
	const safeUser = user || {};
	const [avatar, setAvatar] = useState(safeUser.avatar || "/img.png");
	const [avatarFile, setAvatarFile] = useState(null);
	const [formData,setFormData]=useState({
		name: safeUser.name||"",
		email:safeUser.email||"",
		mobileNo:safeUser.mobileNo||"",
		address:safeUser.address||"",
		pincode:safeUser.pincode||"",


	})
	const handleUplaod =()=>{
	 fileInputRef.current.click();


	}
	const handleChange=(e)=>{
		setFormData((prevState)=>({
			...prevState,
			[e.target.name]: e.target.value
			
			
		}))
	}
	
	function handleFileUplaod(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setAvatarFile(file);
		setAvatar(URL.createObjectURL(file));
		
	}

	
	
	
	function handleSubmit(e) {
		e.preventDefault();
	dispatch(updateSellerProfileAction({ formData, avatar: avatarFile }));
	
	
	}
	
	return (
		<div className="justify-center flex ">
			{success&& <Success message={"Profile  updated successfully"} />}
			{success&& navigate('/seller-profile')}
			<div className={"max-w-xl max-h-1/2 h-full  w-full  flex mt-5 justify-center item-center  "}>
				<div className={" gap-7 grid justify-center item-center w-full' "}>
					<div><p className={"text-center text-5xl font-bold"}>Update Profile</p></div>
					<div className={"gap-5"}>
						

						<form onSubmit={handleSubmit}>
							<div className={"justify-center w-full flex "}>
							<div className={ "relative"}><img className={"w-40 rounded-full items-center" +
								" align-content-center" +
								" justify-center h-40 "}
							     src={avatar} alt="profile image"/>

							<div className={"absolute bottom-4  right-5"}>
						 <button type="button" onClick={handleUplaod} className={"w-full bg-zinc-100"}> <img className={"w-5" +
							 " bg-transparent h-5"} src="/upload.png" alt=""/></button>
								
								<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUplaod} className={"hidden"}/>
								
							</div>
						</div>
							</div>
							<label htmlFor="name">Name:</label>
							<input id="name" name={"name"} onChange={handleChange} value={formData.name} className={"border" +
								" mt-1 w-full p-1 yb-5" +
								" rounded-lg "}
							       type="text"/>
							<label htmlFor="email">Email:</label>
							<input type={"email"} id="email" name={"email"} onChange={handleChange} value={formData.email}
							       className={"border mt-1 w-full p-1 yb-5 rounded-lg "}/>
							<label htmlFor="mobileNo">mobileNo: </label>
							<input type={"tel"} id="mobileNo" name={"mobileNo"} onChange={handleChange} value={formData.mobileNo}
							       className={"border mt-1 w-full p-1 yb-5 rounded-lg "}/>

							<label htmlFor="address">Address: </label>
							<input type={"text"} id="address" name={"address"} onChange={handleChange} value={formData.address} className={"border" +
								" mt-1 w-full p-1 yb-5" +
								" rounded-lg "} />


							<label htmlFor="pincode">Pincode: </label>
					<input id="pincode" name={"pincode"} onChange={handleChange} value={formData.pincode} className={"border mt-1" +
						" w-full p-1 yb-5 rounded-lg "} type="text" />

					<button  className={"bg-yellow-400 rounded-lg p-2 mt-5 w-full"}>Update Profile</button>


				</form>
					</div>
				</div>
			</div>



		</div>
	);
	
}
export default UpdateProfile;