import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { fetchProductDetailsAction } from '../../redux/productSlice.js';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3030/api';

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { product, loading, error } = useSelector((state) => state.Products);
	const { loggedinUser } = useSelector((state) => state.Users);

	useEffect(() => {
		if (id) {
			dispatch(fetchProductDetailsAction({ id }));
		}
	}, [dispatch, id]);

	const currentProduct = product?._id === id ? product : null;
	const imageSrc = Array.isArray(currentProduct?.images)
		? currentProduct?.images?.[0]
		: currentProduct?.images;

	const handleAddToCart = async () => {
		if (!loggedinUser?.token) {
			Swal.fire({
				title: 'Please login first',
				text: 'You need to be logged in to add products to cart.',
				icon: 'info'
			}).then(() => navigate('/login'));
			return;
		}

		const result = await Swal.fire({
			title: 'How many quantity do you want to add?',
			input: 'number',
			inputAttributes: { autocapitalize: 'off', min: 1 },
			showCancelButton: true,
			confirmButtonText: 'Add To Cart',
			showLoaderOnConfirm: true,
			preConfirm: async (quantity) => {
				try {
					if (!quantity || Number(quantity) <= 0) {
						return Swal.showValidationMessage('Please enter a valid quantity');
					}

					const headers = {
						Authorization: `Bearer ${loggedinUser.token}`
					};
					const url = `${BASE_URL}/cart/add-to-cart/${id}`;
					const response = await axios.put(url, { quantity: Number(quantity) }, { headers });

					if (response.status !== 201) {
						return Swal.showValidationMessage(response.data?.message || 'Request failed');
					}

					return response.data;
				} catch (error) {
					Swal.showValidationMessage(`Request failed: ${error.response?.data?.message || error.message || error}`);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});

		if (result.isConfirmed) {
			Swal.fire({
				title: 'Product added to cart successfully!',
				icon: 'success'
			});
		}
	};

	if (loading && !currentProduct) {
		return <div className="p-6 text-center text-lg">Loading product details...</div>;
	}

	if (error && !currentProduct) {
		return (
			<div className="p-6 text-center">
				<p className="text-red-600 font-semibold text-lg">{String(error)}</p>
				<button
					onClick={() => navigate('/products')}
					className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
				>
					Back to Products
				</button>
			</div>
		);
	}

	if (!currentProduct) {
		return (
			<div className="p-6 text-center">
				<p className="text-gray-600 text-lg">Product not found.</p>
				<button
					onClick={() => navigate('/products')}
					className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
				>
					Back to Products
				</button>
			</div>
		);
	}

	const discountAmount = Number(currentProduct?.discount || 0);
	const finalPrice = discountAmount > 0
		? Number(currentProduct?.price || 0) - (Number(currentProduct?.price || 0) * discountAmount) / 100
		: Number(currentProduct?.price || 0);

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-6">
			<button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-blue-600 hover:underline">
				← Back
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="bg-gray-50 flex items-center justify-center p-4">
					<img
						src={imageSrc}
						alt={currentProduct?.name}
						className="w-full max-h-96 object-contain rounded-lg"
					/>
				</div>

				<div className="p-5 md:p-8 flex flex-col gap-4">
					<div>
						<p className="text-sm uppercase tracking-wide text-gray-500">Product Details</p>
						<h1 className="text-3xl font-bold text-gray-900 mt-1">{currentProduct?.name}</h1>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<p className="text-3xl font-extrabold text-green-700">₹{finalPrice.toFixed(2)}</p>
						{discountAmount > 0 && (
							<span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
								{discountAmount}% OFF
							</span>
						)}
					</div>

					{discountAmount > 0 && (
						<p className="text-gray-500 line-through">Original price: ₹{Number(currentProduct?.price || 0).toFixed(2)}</p>
					)}

					<div className="flex flex-wrap gap-3 text-sm font-semibold">
						<span className={`px-3 py-1 rounded-full ${currentProduct?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
							{currentProduct?.isAvailable ? 'In Stock' : 'Out of Stock'}
						</span>
						<span className={`px-3 py-1 rounded-full ${currentProduct?.isInactive ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
							{currentProduct?.isInactive ? 'Inactive Product' : 'Active Product'}
						</span>
					</div>

					<div className="space-y-2 text-gray-700">
						<p><strong>Quantity Available:</strong> {currentProduct?.quantity ?? 0}</p>
						{/*<p><strong>Seller ID:</strong> {currentProduct?.seller || 'N/A'}</p>*/}
						<p><strong>Description:</strong></p>
						<p className="leading-7 text-gray-600">{currentProduct?.description || 'No description provided.'}</p>
					</div>

					<div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
						<button
							onClick={handleAddToCart}
							disabled={!currentProduct?.isAvailable || currentProduct?.isInactive}
							className={`px-5 py-3 rounded-lg font-semibold transition ${currentProduct?.isAvailable && !currentProduct?.isInactive ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
						>
							Add to cart
						</button>
						<button
							onClick={() => navigate('/products')}
							className="px-5 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;

