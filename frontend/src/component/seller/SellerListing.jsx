import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteListedProductAction, fetchSellerListing} from "../../redux/sellerProductSlice.js";
import {useNavigate} from "react-router";
import Swal from "sweetalert2";

const MyOrder = () => {
	const {listings: products,success}= useSelector(state=> state?.SellerProducts)
	const dispatch= useDispatch();
	const navigate= useNavigate();
	const sortedProducts = useMemo(() => {
		const list = Array.isArray(products) ? [...products] : [];
		return list.sort((a, b) => {
			const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
			const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
			return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
		});
	}, [products]);
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
		    .unwrap()
		    .then(() => {
		      Swal.fire({
		        title: "Deleted!",
		        text: "Your product has been unlisted.",
		        icon: "success"
		      });
		    })
		    .catch((message) => {
		      Swal.fire({
		        title: "Delete failed",
		        text: message,
		        icon: "error"
		      });
		    });
  }
});
		
	}
	
	return (
		<div>
			<div className={"flex flex-col  w-full justify-center items-center rounded-lg bg-gray-100 p-4 gap-4 mb-4"}>
				{sortedProducts.map((product,index)=>{
					return (
<div className={" max-w-5/6 w-full"}>
				
				<div  	key={product._id || index} className={"flex  justify-center shadow-lg gap-4"}>
					<div onClick={()=>navigate(`product/${product._id}`)} >
						<img
							src={product.images}
							alt="Product Image"
							className={"max-w-45 h-45 object-cover rounded-lg"}
						/>

					</div>
					<div  className={"flex flex-row w-full  "}>
						
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