import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col gap-3">
      <div className="w-full p-6">
        {/* Header */}
        
          <div className="flex items-center gap-4 mb-6">
          <Button className="cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>

          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
        
        
         
        {/* No Orders */}
        {userOrder?.length === 0 ? (
          <p className="text-gray-800 space-y-6 text-2xl">
            No Orders found for this user
          </p>
        ) : (
          /* Orders */
          <div className="space-y-6 w-full flex flex-col">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-4 w-full flex flex-col gap-3  border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h2>

                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order.amount?.toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* User Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ">
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName || ""}
                    </p>

                    <p className="text-sm text-gray-500">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>

                  {/* Order Status */}
                  <span
                    className={`${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-orange-300"
                    } text-white px-2 py-1 rounded-lg`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Products */}
                {/* Products */}
                <div>
                  <h3 className="font-medium mb-2">Products:</h3>

                  <ul className="space-y-2">
                    {order.products?.map((product, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        {/* Product Image */}
                        <img
                          onClick={() =>
                            navigate(`/products/${product.productId?._id}`)
                          }
                          className="w-16 h-16 object-cover cursor-pointer rounded"
                          src={product.productId?.productImg?.[0]?.url}
                          alt={product.productId?.productName || "Product"}
                        />

                        {/* Product Name */}
                        <span className="w-full sm:w-[300px] line-clamp-2">
                          {product.productId?.productName}
                        </span>

                        {/* Product ID */}
                        <span className="text-sm break-all">
                          {product.productId?._id}
                        </span>

                        {/* Price × Quantity */}
                        <span className="font-medium whitespace-nowrap">
                          ₹{product.productId?.productPrice} ×{" "}
                          {product.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
