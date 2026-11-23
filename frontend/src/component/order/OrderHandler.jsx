
import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router";

const OrderHandler = () => {
  const navigate= useNavigate();
  const orderDetails = useSelector(
    (state) => state.UserOrders.orderDetails
  );
  const token = useSelector((state) => state.Users?.loggedinUser?.token);
const BASE_URL = import.meta.env.VITE_BASE_URL ;
  const handlePayment = async () => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      if (!orderDetails?.id && !orderDetails?.razorpayOrderId) {
        alert("Order ID not found");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: orderDetails.amount,
        currency: orderDetails.currency || "INR",

        name: "Fasal Bazar",
        description: "Order Payment",
        order_id: orderDetails.id || orderDetails.razorpayOrderId,

        prefill: {
          name: "orderDetails.name" ,
          email: "rderDetails.email" ,
          contact: "orderDetails.phone ",
        },

        theme: {
          color: "#3399cc",
        },

        handler: async function (response) {
          try {
            console.log(response);
            const result = await axios.post(
              `${BASE_URL}/order/verify`,
              
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (result.data.success) {
              navigate('/order/payment/success');
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment window closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(response.error.description);
      });

      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className={"flex justify-center items-center min-h-screen"}>
      <button className={"bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"} onClick={handlePayment}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default OrderHandler;
