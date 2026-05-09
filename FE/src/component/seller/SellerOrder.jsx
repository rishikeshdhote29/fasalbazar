import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import {fetchSellerOrdersAction} from "../../redux/orderSlice.js";
import {useNavigate} from "react-router";


const MyOrder = () => {
	const orders= useSelector(state=> state?.Orders?.orders || [])
	const dispatch= useDispatch();
	const loggedinUser = useSelector(state => state.Users?.loggedinUser);
	const token = loggedinUser?.token;
	const [statusMap, setStatusMap] = useState({});
const navigate = useNavigate();
	useEffect(() => {
		dispatch(fetchSellerOrdersAction())
	},[dispatch])

	useEffect(()=>{
		const map = {};
		(orders||[]).forEach(o=>{ map[o._id] = o.status });
		setStatusMap(map);
	},[orders])

	const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3030/api';

	const handleStatusChange = (orderId, value) => {
		setStatusMap(prev=> ({...prev, [orderId]: value}));
	}

	const updateStatus = async (orderId) => {
		try{
			const newStatus = statusMap[orderId];
			if(!newStatus) return alert('Select a status');
			await axios.put(`${BASE_URL}/order/update-order-status/${orderId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
			alert('Order status updated');
			dispatch(fetchSellerOrdersAction());
		}catch(err){
			console.error(err);
			alert(err.response?.data?.message || err.message || 'Failed to update status');
		}
	}

	return (
		<div>
			<div className={"flex flex-col  w-full justify-center items-center rounded-lg bg-gray-100 p-4 gap-4 mb-4"}>
				{orders.map((product, index)=>{
					return (
		<div className={" max-w-5/6 w-full"} key={product._id || index}>
						<div className={"flex  justify-evenly w-full"}>
							<p className={"text-lg font-bold"}>Order ID: {product.orderId}</p>
						
						<p className={"text-lg text-end font-bold"}>Tracking Id: {product.trackingId}</p>
							 <p  className={"text-lg text-end font-bold"}>Order Date: {product.orderDate}</p>
						</div>

					<div className={"flex  justify-center shadow-lg gap-4"}>
							
						
						<div >
							<img
								src={product.product?.images}
								alt="Product Image"
								className={"max-w-45 h-45 object-cover rounded-lg"}
							/>
						</div>
						<div  className={"flex flex-row w-full  "}>
							<div className={"ms-5 w-full  max-w-3/5 "}>
								<h1 className={"text-lg"}>{product.product?.name}</h1>
								<h1 className={"text-lg"}>{product.product?.description}</h1>
							</div>
					
					
							<div className={" max-w-2/5 justify-end text-end justify-items-end"}>
								<div className={"text-lg flex text-end font-bold"}>Status:  {product.status}</div>
								<div className={"text-lg flex text-end font-bold"}>Amount: ₹{product.amount}</div>
								<div className={"text-lg flex text-end font-bold"}>Quantity: {product.quantity} {product.unit||"Unit"}</div>
							</div>
							</div>
							<div className={" max-w-2/5 ms-3 justify-end"}>
								<div className="mb-2">
									<select value={statusMap[product._id] || product.status} onChange={e=>handleStatusChange(product._id, e.target.value)} className="border rounded p-1">
										<option value="order placed">order placed</option>
										<option value="processing">processing</option>
										<option value="shipped">shipped</option>
										<option value="out for delivery">out for delivery</option>
										<option value="delivered">delivered</option>
										<option value="cancelled">cancelled</option>
									</select>
									<button onClick={()=>updateStatus(product._id)} className={"ml-2 border rounded p-1 bg-green-500 text-white"}>Update</button>
								</div>
								
								<button onClick={() => navigate(`/track/${product.trackingId}`)} className={"border rounded p-1 border-amber-400 my-3  bg-amber-400"}>Track Order </button>
								<button onClick={() => navigate(`/seller/order/${product.orderId}`)} className={"border" +
									" rounded p-1 border-amber-400 my-3  bg-amber-400"}>order details </button>
								
								<br/>
							</div>
						</div>
					</div>
					)
				}
				)
				}
			</div>
		</div>
	)
}

export default MyOrder;