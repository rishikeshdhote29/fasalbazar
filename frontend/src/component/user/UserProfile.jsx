import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {fetchUserAction} from "../../redux/userSlice.js";

const UserProfile = () => {
	const dispatch = useDispatch();
	const {userType} = useSelector(state=> state.Users);
const navigate = useNavigate();
	useEffect(() => {
		dispatch(fetchUserAction());
	}, [dispatch]);
	const user = useSelector(state=> state.Users.user);
	return (
		<div className='flex   justify-center min-h-screen bg-green-100'>
			<div className="max-w-3/5 mt-10 w-full ">
			
			<div className=' border bg-grey-300 p-4  mt-10   rounded-lg shadow-md'>
				 <div className='flex flex-col items-center gap-4'>
					<h2 className='text-2xl text-center font-bold mb-4'>User Profile</h2>
					 <img src={user?.avatar} className={"max-w-40 w-40 h-40  max-h-40 justify-center rounded-full"} alt=""/>
				 </div>
				<div className='mt-6 grid gap-4 sm:grid-cols-2'>
					<p className='text-lg  ms-10 '><span className='font-semibold'>Name:</span> {user?.name||"not available"}</p>
					<p className='text-lg  ms-10'><span className='font-semibold'>Email:</span> {user?.email||"not available"}</p>
					
					 <p className='text-lg  ms-10'><span className='font-semibold'>Role:</span> {userType||"not available"}</p>
					 <p className='text-lg  ms-10'><span className='font-semibold'>mobileNo:</span> {user?.mobileNo||"not" +
						 " available"}</p>
					 <p className='text-lg  ms-10'><span className='font-semibold'>Address:</span> {user?.address||"not" +
						 " available"}</p>
					 <p className='text-lg  ms-10'><span className='font-semibold'>Pincode:</span> {user?.pincode||"not" +
						 " available"}</p>
					
				</div>
				< div className={"flex justify-center"}>
					<button onClick={()=>navigate("/update-profile")} className={"bg-amber-400 p-1 px-15 rounded-lg"}>
				update profile
				</button>
				</div>
							</div>
			</div>
		</div>
	);
};

export default UserProfile;