import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-6 text-gray-800">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-2">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-primary-600 text-white py-3 rounded-xl cursor-pointer hover:bg-primary-700 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full border border-primary-600 text-primary-600 py-3  cursor-pointer rounded-xl hover:bg-primary-50 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;