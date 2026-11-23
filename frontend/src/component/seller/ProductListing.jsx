import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {listProductAction} from "../../redux/sellerProductSlice.js";
import Success from "../utils/Success.jsx";
import ErrorMsg from "../utils/ErrorMsg.jsx";

const ProductListing = () => {
	const fileInputRef = useRef(null);
	const [imagePrev,setImagePrev] = useState(null);
	const [image,setImage]= useState(null);
	const {success,error,loading}=useSelector(state=>state.SellerProducts);
	const [productDetails, setProductDetails] = React.useState({
		name:"",
		price:"",
		discount:"",
		description:"",
		quantity:"",
		unit:""
	});
	const dispatch = useDispatch();
	const handleChange=(e)=>{
		setProductDetails((prevState)=>({
			...prevState,
				[e.target.name]: e.target.value
		}))
		
	}
	
	function handleFileUplaod(e) {
		e.preventDefault();
		const file = e.target.files[0];
		setImage(file);
		setImagePrev(URL.createObjectURL(file));
		
		
		
	}
	
	function handleUplaod() {
		fileInputRef.current.click();
	}
	
	function handleSubmit(e) {
		e.preventDefault();
		dispatch(listProductAction({ formData: productDetails, avatar: image }))
			.unwrap()
			.catch((message) => {
				console.error(message);
			});
	}
	
	return (
		<div className="flex mt-5 justify-center items-center">
			{success && <Success message={"product listed successful"} />}
		
			
		<div className={"   w-full justify-center max-w-4xl"}>
		  <p className={"font-bold text-3xl text-center"}>List product </p>
			<div className={"flex justify-center"}>
			
			<div className={"mt-5 max-w-4/6  flex justify-center  "}>
				
				<form onSubmit={handleSubmit}>
					
					<label htmlFor="name">Product Name: </label>
					<input id={'name'} name={'name'} value={productDetails.name} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product name"} type="text" required/>
					
					
					<label htmlFor="description">Product description: </label>
					<input id={'description'} required name={'description'} value={productDetails.description} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product description"} type="text"/>
					<label htmlFor="price">Product price </label>
					<input id={'price'} required name={'price'} value={productDetails.price} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product price"} type="number" min="0.01" step="0.01"/>
					<label htmlFor="quantity">Product quantity </label>
					<input id={'quantity'} required name={'quantity'} value={productDetails.quantity} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product quantity"} type="number" min="1" step="1"/>
					
					
					<label htmlFor="name">Product discount: </label>
					<input id={'discount'} required name={'discount'} value={productDetails.discount} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product discount"} type="number" min="0" step="0.01"/>
					<label htmlFor="name">Product Unit: </label>
					<select name="unit" className={"w-full border rounded-lg mb-2 "} onChange={handleChange} value={productDetails.unit} id="unit">
						< option value="kg">Kg</option>
						< option value="duzen">Duzen</option>
						<option value={"piece"}>Piece</option>
						<option value={"liter"}>Liter</option>
						<option value={"pack"}>Pack</option>
						<option value={"quintal"}>quintal</option>
						
						
						
						
					</select>
					<div>
						<label htmlFor="image">image</label>
						<br/>
						 <button type="button" onClick={handleUplaod} className={"w-full bg-zinc-100"}> <img className={"w-5 h-5 bg-blue-600 rounded "} src="/upload.png" alt=""/> uplaod image</button>
								
								<input ref={fileInputRef} required type="file" accept="image/*" onChange={handleFileUplaod} className={"hidden"}/>
						
						<img src={imagePrev}  className={"h-60 border w-60"} alt="img prev"/>
					</div>
					
					<button  className={"bg-yellow-400 rounded-lg p-2 mt-5 w-full"}>{loading?<p>listting....</p>:<p> List product   </p>} </button>
					
				</form>
			
			
			
			</div>
			
			</div>
			
			
		</div>
		</div>
	);
};

export default ProductListing;