import React, {useEffect} from 'react';
import {fetchCartAction, removeFromCartAction} from "../../redux/productSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {palceOrderAction} from "../../redux/orderSlice.js";
import Success from "../utils/Success.jsx";
import {useNavigate} from "react-router";

const Cart = () => {
	const products = useSelector(state => state.Products.cart?.products || []);
	const success = useSelector(state => state.Orders.success);
	const navigate= useNavigate()
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCartAction());
	}, [dispatch,success]);
	
	function handleCheckOut(e) {
 e.preventDefault();
 
 
	 dispatch(palceOrderAction({ paymentMethod: "upi" }));
	
	}
	
	function handleRemove(e,id) {
		e.preventDefault()
		dispatch(removeFromCartAction({id}));
		
	}
	
	return (
		<div>
			{success&& <Success message={"order palce successfuly"}/>}
			{success&& navigate('/orders')}
			<h1 className={"text-5xl ms-4 my-4"}>Cart</h1>

			<div className={"grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4"}>
					<div
					
						className={"col-span-2 md:col-span-2 ms-5 bv order-last  md:order-last lg:order-first" +
							" rounded shadow-lg" +
							" w-full  "}
					>
					
				{products.map((product, index) => (
					console.log("product in cart", product) ||
			
			<div className={"shadow-lg gap4  rounded-lg bg-gray-100 p-4 mb-4"}>
				<div  	key={product._id || index} className={"flex gap-4"}>
							<div>
								<img
									src={product.product.images}
									alt="Product Image"
									className={"max-w-45 h-45 object-cover rounded-lg"}
								/>
							</div>
						<div className={"flex flex-row w-full  "}>
								<div className={"ms-5 w-full  max-w-3/5 "}>
								<h1 className={"text-lg"}>{product.product.name}</h1>
								<h1 className={"text-lg"}>{product.product.description}</h1>
							</div>
							
							{	(!product.product.isAvailable || product.product.isInactive) ? (
							<div className={"flex flex-col w-full h-auto  bg-red-600 justify-center items-center "}>
								this product is not available or inactive
							</div>):(
							
						<div className={" max-w-2/5 jutify-end"}>	<div className={"text-end justify-items-end"}>
								<div className={"text-lg flex text-end font-bold"}>Price: ₹{product.product.price}</div>
								
								<div className={"text-lg flex text-end font-bold"}>Quantity: {product.quantity} Unit</div>
							<div className={"text-lg flex text-end font-bold"}>Discount: {product.product.discount} %</div>
								<div className={"text-lg flex text-end font-bold"}> Total Price: ₹{(product.product.price*product.quantity)-( (product.product.price *product.quantity)*product.product.discount/100)}</div>
							
							</div>
						
						
						</div>)}
							<div>
								
								<button onClick={e=>handleRemove(e,product.product._id)} className={"border rounded" +
									" p-1 border-red-700 my-3" +
									"  bg-red-700"}>Remove </button>
								
							</div>
							
						</div>
						

					</div>
					
				</div>
				))}
				</div>
				<div className={" col-span-1 sm:order-first h-fit mx-5 sticky top-4"}>
							<div className={"max-h-64 h-full col-span-1 sticky shadow-lg bg-green-300"}>
							<h1 className={"text-center p-4"}>	<strong>Order Summary</strong></h1>
								<div className={"p-4"}>
								
								<div className={"text-lg  font-bold"}>Total Items:  {products.length}</div>
								
								<div className={"text-lg  font-bold"}>Total Price: ₹{products.reduce((total, item) => total + item.product.price*item.quantity, 0)}</div>
								<div className={"text-lg  font-bold"}>Total Discount: ₹{products.reduce((total, item) => total + ((item.product.price * item.quantity) * item.product.discount / 100), 0)}</div>
								
								<hr/>
								<div className={"text-lg  font-bold"}>Final payment: ₹{products.reduce((total, item) => total + item.product.price*item.quantity, 0)}</div>
							</div>
							  < button onClick={handleCheckOut} className={"w-full bg-yellow-500 rounded-xl p-2 mt-4" +
								  " text-white" +
								  " font-bold"}>Proceed to Checkout</button>
								
							</div>
						</div>
			</div>
		</div>
	);
};

export default Cart;