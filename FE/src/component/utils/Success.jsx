import {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {successAction} from "../../redux/userSlice.js";
import Swal from "sweetalert2";

const Success = ({ message }) => {
	const dispatch = useDispatch();
	const reduxMessage = useSelector((state) => state.Users?.message);
	const successText = message || reduxMessage;
	
	useEffect(() => {
		if (!successText) return;
		Swal.fire({
			title: "Good job!",
			text: successText,
			icon: "success"
		});
		dispatch(successAction());
	}, [dispatch, successText]);
	
};

export default Success;