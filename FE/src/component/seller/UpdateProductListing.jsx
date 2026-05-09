import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchProductDetailsAction, listProductAction, updateProductListingAction} from "../../redux/productSlice.js";
import Success from "../utils/Success.jsx";
import ErrorMsg from "../utils/ErrorMsg.jsx";
import {useParams} from "react-router";

const UpdateProductListing = () => {
	const productId=useParams().id;
	const dispatch = useDispatch();

	useEffect(()=>{
		dispatch(fetchProductDetailsAction({id:productId}));
	},[dispatch])
	
	const fileInputRef = useRef(null);
	const [image,setImage]= useState(null);
	const {success,error,product}=useSelector(state=>state.Products);
	const [imagePrev,setImagePrev] = useState(product.images);
	console.log("product" ,product.name);
	const [productDetails, setProductDetails] = useState({
		name:product.name||"",
		price:product.price||"",
		discount:product.discount||"",
		description:product.description||"",
		quantity:product.quantity||"",
		unit:product.unit||""
	});
	const handleChange=(e)=>{
		setProductDetails((prevState)=>({
			...prevState,
				[e.target.name]: e.target.value
		}))
		
	}
	useEffect(() => {
  if (product) {
    setProductDetails({
      name: product.name || "",
      price: product.price || "",
      discount: product.discount || "",
      description: product.description || "",
      quantity: product.quantity || "",
	    	  unit: product.unit || ""
    });
    setImagePrev(product.images || "");
  }
}, [product]);

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
		
			dispatch(updateProductListingAction({ id:productId,formData: productDetails, avatar: image }));
		
	
	
	
	}
	
	return (
		<div className="flex mt-5 justify-center items-center">
		
		
			
		<div className={"   w-full justify-center max-w-4xl"}>
		  <p className={"font-bold text-3xl text-center"}>Update product </p>
			<div className={"flex justify-center"}>
			
			<div className={"mt-5 max-w-4/6  flex justify-center  "}>
				
				<form onSubmit={handleSubmit}>
					
					<label htmlFor="name">Product Name: </label>
					<input id={'name'} name={'name'} value={productDetails.name} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product name"} type="text"/>
					
					
					<label htmlFor="description">Product description: </label>
					<input id={'description'} required name={'description'} value={productDetails.description} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product description"} type="text"/>
					<label htmlFor="price">Product price </label>
					<input id={'price'} required name={'price'} value={productDetails.price} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product price"} type="text"/>
					<label htmlFor="quantity">Product quantity </label>
					<input id={'quantity'} required name={'quantity'} value={productDetails.quantity} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product quantity"} type="text"/>
					
					
					<label htmlFor="name">Product discount: </label>
					<input id={'discount'} required name={'discount'} value={productDetails.discount} onChange={handleChange} className={"w-full" +
						" border" +
						" rounded-lg mb-2 "} placeholder={"product discount"} type="text"/>
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
								
								<input ref={fileInputRef}  type="file" accept="image/*" onChange={handleFileUplaod} className={"hidden"}/>
						
						<img src={imagePrev}  className={"h-60 border w-60"} alt="img prev"/>
					</div>
					
					<button  className={"bg-yellow-400 rounded-lg p-2 mt-5 w-full"}>Update  product details </button>
					
				</form>
			
			
			
			</div>
			
			</div>
			
			
		</div>
		</div>
	);
};

export default UpdateProductListing;