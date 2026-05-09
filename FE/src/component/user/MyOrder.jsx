import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {calcelOrdersAction, fetchOrdersAction} from "../../redux/orderSlice.js";
import Swal from "sweetalert2";
import {useNavigate} from "react-router";

const MyOrder = () => {
	const orders= useSelector(state=> state?.Orders?.orders)
	const dispatch= useDispatch();
	const navigate= useNavigate();
	useEffect(() => {
		dispatch(fetchOrdersAction())
	},[dispatch]
	)
	function cancelHandle(e, id) {
		e.preventDefault();
		Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, cancel it!"
}).then((result) => {
	
	
  if (result.isConfirmed)
  {
		  dispatch(calcelOrdersAction({id}))
	  Swal.fire({
    title: "Calcelled!",
    text: "Your order has been cancel.",
    icon: "success"
  });
  }
});
	
	}
	return (
		<div>
			<div className={"flex flex-col  w-full justify-center items-center rounded-lg bg-gray-100 p-4 gap-4 mb-4"}>
				{orders.map((product, index)=>{
					return (
<div className={" max-w-5/6 w-full"}>
					<div className={"flex  justify-evenly w-full"}>
						<p className={"text-lg font-bold"}>Order ID: {product.orderId}</p>
					<p className={"text-lg text-end font-bold"}>Tracking Id: {product.trackingId}</p>

					</div>

				<div  	key={product._id || index} className={"flex  justify-center shadow-lg gap-4"}>
					<div onClick={()=>navigate(`/products/${product.product._id}`)} className={"cursor-pointer"}>
						<img
							src={product.product.images}
							alt="Product Image"
						  	className={"max-w-45 h-45 object-cover rounded-lg"}
						/>

					</div>
					<div onClick={()=>navigate(`/products/${product.product._id}`)} className={"flex flex-row w-full" +
						"  "}>
						<div className={"ms-5 w-full  max-w-3/5 "}>
							<h1 className={"text-lg"}>{product.product.name}</h1>
							<h1 className={"text-lg"}>{product.product.description}</h1>
						</div>

						<div className={" max-w-2/5 justify-end"}>	<div className={"text-end justify-items-end"}>
							<div className={"text-lg flex text-end font-bold"}>Status:  {product.status}</div>

							<div className={"text-lg flex text-end font-bold"}>Amount: ₹{product.amount}</div>

							<div className={"text-lg flex text-end font-bold"}>Quantity: {product.quantity} Unit</div>



						</div>
 

						</div>
						<div className={" max-w-2/5 ms-3 justify-end"}>
							<button onClick={() => navigate(`/track/${product.trackingId}`)} className={"border" +
								" rounded p-1" +
								" border-amber-400" +
								" my-3" +
								"  bg-amber-400"}>Track Order </button>
							<br/>
							<button onClick={e=>cancelHandle(e,product._id)} className={"border rounded p-1" +
								" bg-red-700"}>Cancel Order </button>






						</div>
					</div>


				</div>
</div>)
				}

				)}

			</div>
			
		</div>
	);
};

export default MyOrder;