
import React, { useEffect, useMemo, useState } from "react";
import {
    fetchCartAction,
    removeFromCartAction
} from "../../redux/userProductSlice.js";

import { useDispatch, useSelector } from "react-redux";
import { palceOrderAction } from "../../redux/userOrderSlice.js";
import { useNavigate } from "react-router";

const Cart = () => {

    const products = useSelector(
        state => state.UserProducts.cart?.products || []
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");

    // Fetch cart when component mounts
    useEffect(() => {
        dispatch(fetchCartAction());
    }, [dispatch]);

    // Filter valid products
    const validProducts = useMemo(() => {
        return products.filter(
            item =>
                item.product &&
                item.product.isAvailable &&
                !item.product.isInactive
        );
    }, [products]);

    // Calculate cart summary
    const {
        totalItems,
        totalPrice,
        totalDiscount,
        finalPayment
    } = useMemo(() => {

        const totalItems = validProducts.reduce(
            (total, item) => total + item.quantity,
            0
        );

        const totalPrice = validProducts.reduce(
            (total, item) =>
                total + item.product.price * item.quantity,
            0
        );

        const totalDiscount = validProducts.reduce(
            (total, item) =>
                total +
                (
                    item.product.price *
                    item.quantity *
                    (item.product.discount || 0)
                ) / 100,
            0
        );

        return {
            totalItems,
            totalPrice,
            totalDiscount,
            finalPayment: totalPrice - totalDiscount
        };

    }, [validProducts]);

    // Checkout handler
    async function handleCheckOut(e) {
        e.preventDefault();

        if (loading) return;

        if (validProducts.length === 0) {
            setError("Your cart has no available products.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await dispatch(
                palceOrderAction()
            ).unwrap();

            navigate("/order/payment", {
                state: result
            });

        } catch (err) {
            console.error("Checkout error:", err);

            setError(
                err?.message ||
                err?.message ||
                err ||
                "Unable to create order. Please try again."
            );

        } finally {
            setLoading(false);
        }
    }

    // Remove product handler
    async function handleRemove(e, id) {
        e.preventDefault();

        if (removingId) return;

        try {
            setRemovingId(id);
            setError("");

            await dispatch(
                removeFromCartAction({ id })
            ).unwrap();

            // Refresh cart after successful removal
            await dispatch(fetchCartAction());

        } catch (err) {
            console.error("Remove product error:", err);

            setError(
                err?.message ||
                err ||
                "Unable to remove product."
            );

        } finally {
            setRemovingId(null);
        }
    }

    return (
        <div className="min-h-screen">

            <h1 className="text-5xl ms-4 my-6">
                Cart
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 mx-5 mb-4 rounded">
                    {typeof error === "string"
                        ? error
                        : "Something went wrong. Please try again."}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Cart Products */}
                <div className="col-span-1 md:col-span-2 ms-5 rounded shadow-lg p-3 lg:order-first order-last">

                    {products.length === 0 ? (

                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold">
                                Your cart is empty
                            </h2>

                            <button
                                onClick={() => navigate("/products")}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg mt-4"
                            >
                                Continue Shopping
                            </button>
                        </div>

                    ) : (

                        products.map((item, index) => {

                            const product = item.product;

                            if (!product) return null;

                            const isUnavailable =
                                !product.isAvailable ||
                                product.isInactive;

                            const itemPrice =
                                product.price * item.quantity;

                            const itemDiscount =
                                itemPrice *
                                (product.discount || 0) / 100;

                            return (

                                <div
                                    key={item._id || index}
                                    className="shadow-lg rounded-lg bg-gray-100 p-4 mb-4"
                                >

                                    <div className="flex flex-col sm:flex-row gap-4">

                                        {/* Product Image */}
                                        <div className="shrink-0">

                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    product.images
                                                }
                                                alt={product.name}
                                                className="w-36 h-36 object-cover rounded-lg"
                                            />

                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">

                                            <div className="w-full">

                                                <h2 className="text-xl font-semibold">
                                                    {product.name}
                                                </h2>

                                                <p className="text-gray-600 mt-2">
                                                    {product.description}
                                                </p>

                                            </div>

                                            {isUnavailable ? (

                                                <div className="flex items-center justify-center bg-red-100 text-red-700 p-3 rounded-lg min-w-40">
                                                    Product unavailable or inactive
                                                </div>

                                            ) : (

                                                <div className="min-w-40">

                                                    <p className="text-lg font-bold">
                                                        Price: ₹{product.price}
                                                    </p>

                                                    <p className="text-lg font-bold">
                                                        Quantity: {item.quantity} Unit
                                                    </p>

                                                    <p className="text-lg font-bold">
                                                        Discount: {product.discount || 0}%
                                                    </p>

                                                    <p className="text-lg font-bold text-green-700">
                                                        Subtotal: ₹{(itemPrice - itemDiscount).toFixed(2)}
                                                    </p>

                                                </div>

                                            )}

                                            {/* Remove Button */}
                                            <div className="flex items-end">

                                                <button
                                                    disabled={removingId === product._id}
                                                    onClick={(e) =>
                                                        handleRemove(
                                                            e,
                                                            product._id
                                                        )
                                                    }
                                                    className="border border-red-700 p-2 rounded bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
                                                >
                                                    {removingId === product._id
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

                {/* Order Summary */}
                <div className="col-span-1 mx-5 h-fit sticky top-4">

                    <div className="shadow-lg rounded-lg bg-green-100">

                        <h2 className="text-center p-4 text-xl font-bold">
                            Order Summary
                        </h2>

                        <div className="p-4 space-y-3">

                            <div className="flex justify-between font-bold">
                                <span>Total Items:</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="flex justify-between font-bold">
                                <span>Total Price:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between font-bold text-green-700">
                                <span>Total Discount:</span>
                                <span>- ₹{totalDiscount.toFixed(2)}</span>
                            </div>

                            <hr className="border-gray-400" />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Final Payment:</span>
                                <span>₹{finalPayment.toFixed(2)}</span>
                            </div>

                            <p className="text-xs text-gray-600">
                                Shipping charges and taxes, if applicable,
                                are calculated at checkout.
                            </p>

                        </div>

                        <button
                            onClick={handleCheckOut}
                            disabled={
                                loading ||
                                validProducts.length === 0
                            }
                            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl p-3 mt-2 text-white font-bold"
                        >
                            {loading
                                ? "Creating Order..."
                                : "Proceed to Checkout"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Cart;
