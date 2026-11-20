
import React from 'react';

const OrderSuccess = () => {
    return (
        <div className="flex flex-col mt-10 justify-center items-center gap-4">

            <img
                className="h-30 w-30"
                src="/tick.png"
                alt="Order successful"
            />

            <h2 className="text-2xl font-bold text-green-600">
                Order Successfully Placed!
            </h2>

            <p className="text-gray-600">
                Your order has been successfully completed.
            </p>

        </div>
    );
};

export default OrderSuccess;
