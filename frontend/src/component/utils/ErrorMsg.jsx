import {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {errorAction} from "../../redux/userSlice.js";
import Swal from "sweetalert2";

const ErrorMsg = ({ message }) => {
	const dispatch = useDispatch();
	const error = useSelector((state) => state.Users?.error);
	const errorText = message || error;
	
	useEffect(() => {
		if (!errorText) return;
		Swal.fire({
			title: "Oops!",
			text: errorText,
			icon: "error"
		});
		dispatch(errorAction());
	}, [dispatch, errorText]);
	
};

export default ErrorMsg;