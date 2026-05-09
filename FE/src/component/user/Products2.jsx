import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getAllProductsAction} from "../../redux/productSlice.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router';

const Products = () => {
	const dispatch= useDispatch();
	const navigate = useNavigate();
	const {products}=useSelector(state=> state.Products)
	const {loggedinUser}= useSelector(state => state.Users)
	const [sortBy, setSortBy] = useState("newest");

	const sortedProducts = useMemo(() => {
		const list = Array.isArray(products) ? [...products] : [];

		const getSortTime = (product) => {
			const createdAt = product?.createdAt ? new Date(product.createdAt).getTime() : 0;
			return Number.isFinite(createdAt) ? createdAt : 0;
		};

		list.sort((a, b) => {
			if (sortBy === "price-asc") {
				return Number(a?.price || 0) - Number(b?.price || 0);
			}
			if (sortBy === "price-desc") {
				return Number(b?.price || 0) - Number(a?.price || 0);
			}
			if (sortBy === "name-asc") {
				return String(a?.name || "").localeCompare(String(b?.name || ""), undefined, { sensitivity: "base" });
			}
			if (sortBy === "name-desc") {
				return String(b?.name || "").localeCompare(String(a?.name || ""), undefined, { sensitivity: "base" });
			}
			if (sortBy === "oldest") {
				return getSortTime(a) - getSortTime(b);
			}
			return getSortTime(b) - getSortTime(a);
		});

		return list;
	}, [products, sortBy]);
	
	const handleAddToCart=(productId)=>{
		console.log("button clicked add to cart");
	Swal.fire({
  title: "How many quantity do you want to add?",
  input: "number",
  inputAttributes: { autocapitalize: "off" },
  showCancelButton: true,
  confirmButtonText: "Add To Cart",
  showLoaderOnConfirm: true,
  preConfirm: async (quantity) => {
    try {
	  if (!quantity || quantity <= 0) {
	    return Swal.showValidationMessage("Please enter a valid quantity");
	  }
	  const headers={
		Authorization:`Bearer ${loggedinUser.token}`
	  }
      const url = `http://localhost:3030/api/cart/add-to-cart/${productId}`;
      const response = await axios.put(url, { quantity }, { headers });
	 
	  console.log("response from add to cart", response);
      if (response.status !== 201) {
        return Swal.showValidationMessage(response.data.message || "Request failed");
      }
      return response.data;
    } catch (error) {
      console.log("error in add to cart", error);
      Swal.showValidationMessage(`Request failed: ${error.message || error}`);
    }
  },
  allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: `Product added to cart successfully!`,
      icon: 'success'
    });
  }
});
	}
	useEffect(()=>{
	dispatch(getAllProductsAction())
	},[dispatch]);
	return (
		<div>
			<div className={"flex flex-col md:flex-row md:items-center md:justify-between gap-3 ms-4 my-4"}>
				<h1 className={"text-5xl"}>Products</h1>
				<div className={"w-full md:w-auto flex items-center gap-2"}>
					<label htmlFor="sortBy" className={"font-semibold"}>Sort by:</label>
					<select
						id="sortBy"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className={"border rounded px-3 py-2 bg-white"}
					>
						<option value="newest">Newest first</option>
						<option value="oldest">Oldest first</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="name-asc">Name: A to Z</option>
						<option value="name-desc">Name: Z to A</option>
					</select>
				</div>
			</div>
			<div className="w-full mx-auto">
				
				{(sortedProducts.length===0)?<p className={"text-center text-gray-500"}>No products available</p>:
				<div className={"w-full   gap-4 max-w-10/10 mx-auto grid grid-cols-1 place-content-center md:grid-cols-2" +
					" lg:grid-cols-4"}>
					{sortedProducts?.map?.((product)=>{
						return (
							<div key={product._id} className={"border relative p-4 rounded-lg shadow-md"}>
											<div className={"gap-2"}>
								
												<button className={"w-full text-left cursor-pointer"} onClick={()=>navigate(`/products/${product._id}`)}>
									<img  src={product.images} alt={product.name} className={"w-full h-48 object-cover" +
								" rounded-md mb-4"} />
										<strong>{product.name}</strong>
					
						<p>{product.description}</p>
								</button>
								</div>
						<p><strong>Price:</strong> ₹{product.price}</p>
								{
									product.isAvailable?<button onClick={(e)=>{e.stopPropagation();handleAddToCart(product._id)}} className="btn m px-10 cursor-pointer  bg-yellow-500 rounded-xl p-1   btn-primary">Add to cart</button>
										:<span className={"text-red-500 font-bold"}>Out of stock</span>
								}
					</div>
						)
					})}
					
					
					
				
				</div>
				}
			</div>
			
			</div>
	);
};

export default Products;
