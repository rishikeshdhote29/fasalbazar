import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchOrdersAction, fetchSellerOrdersAction} from "../../redux/orderSlice.js";
import {deleteListedProductAction, fetchSellerListing} from "../../redux/productSlice.js";
import {useNavigate} from "react-router";
import Swal from "sweetalert2";

const MyOrder = () => {
	const {products,success}= useSelector(state=> state?.Products)
	const dispatch= useDispatch();
	const navigate= useNavigate();
	useEffect(() => {
		dispatch(fetchSellerListing())
	},[dispatch]
	)
	const handleUpdate=(e,id)=>{
		e.preventDefault();
		navigate(`/product-update/${id}`)
		
			}
	
	function handleDelete(e, id) {
		e.preventDefault();
		Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
	
	
  if (result.isConfirmed)
  {
		  dispatch(deleteListedProductAction({id}))
	  Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  }
});
		
	}
	
	return (
		<div>
			<div className={"flex flex-col  w-full justify-center items-center rounded-lg bg-gray-100 p-4 gap-4 mb-4"}>
				{products.map((product)=>{
					return (
<div className={" max-w-5/6 w-full"}>
				
				<div  	key={product._id || index} className={"flex  justify-center shadow-lg gap-4"}>
					<div onClick={()=>navigate(`/products/${product._id}`)} >
						<img
							src={product.images}
							alt="Product Image"
							className={"max-w-45 h-45 object-cover rounded-lg"}
						/>

					</div>
					<div onClick={()=>navigate(`/products/${product._id}`)}  className={"flex flex-row w-full  "}>
						<div className={"ms-5 w-full  max-w-3/5 "}>
							<h1 className={"text-lg"}>{product.name}</h1>
							<h1 className={"text-lg"}>{product.description}</h1>
						</div>

						<div className={" max-w-2/5 justify-end"}>	<div className={"text-end justify-items-end"}>
							<div className={"text-lg flex text-end font-bold"}>Discount:  {product.discount}%</div>

							<div className={"text-lg flex text-end font-bold"}>Amount: ₹{product.price}</div>

							<div className={"text-lg flex text-end font-bold"}>Quantity: {product.quantity}  {product.unit||"unit"}</div>



						</div>


						</div>
						{product.isInactive?
							<div className={" max-w-2/5 ms-5 h-auto  bg-red-500 justify-center" +
								" items-center flex"}>
									Product is Unlisted
								</div>
						:
						<div className={" max-w-2/5 ms-3 justify-end"}>
							<button onClick={(e)=>handleUpdate(e,product._id )} className={"border rounded p-1" +
								" border-amber-400 my-3" +
								"  bg-amber-400"}>Update </button>
							<br/>
							<button onClick={(e)=>handleDelete(e,product._id )} className={"border rounded p-1" +
								" bg-red-700"}>UnList</button>
						
						</div>}
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