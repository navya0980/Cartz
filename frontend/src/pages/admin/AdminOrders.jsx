import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("❌ Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center w-[200px] h-[200px] flex justify-center items-center  border-gray-100 shadow-lg py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }

  return (
    <div className="w-full md:pl-[350px] py-20 pl-5 md:py-10  md:pr-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Admin - All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        // <div className="w-full overflow-x-auto">
        //   <table className="min-w-[900px] w-full border border-gray-200 text-left text-sm">
        //     {/* Table Header */}
        //     <thead className="bg-gray-100">
        //       <tr>
        //         <th className="px-4 py-2 border">
        //           Order ID
        //         </th>

        //         <th className="px-4 py-2 border">
        //           User
        //         </th>

        //         <th className="px-4 py-2 border">
        //           Products
        //         </th>

        //         <th className="px-4 py-2 border">
        //           Amount
        //         </th>

        //         <th className="px-4 py-2 border">
        //           Status
        //         </th>

        //         <th className="px-4 py-2 border">
        //           Date
        //         </th>
        //       </tr>
        //     </thead>

        //     {/* Table Body */}
        //     <tbody>
        //       {orders.map((order) => (
        //         <tr
        //           key={order._id}
        //           className="hover:bg-gray-50"
        //         >
        //           {/* Order ID */}
        //           <td className="px-4 py-2 border">
        //             {order._id}
        //           </td>

        //           {/* User */}
        //           <td className="px-4 py-2 border">
        //             {order.user?.name || "N/A"}
        //             <br />

        //             <span className="text-xs text-gray-500">
        //               {order.user?.email || "N/A"}
        //             </span>
        //           </td>

        //           {/* Products */}
        //           <td className="px-4 py-2 border">
        //             {order.products?.map((p, idx) => (
        //               <div
        //                 key={idx}
        //                 className="text-sm"
        //               >
        //                 {p.productId?.productName || "N/A"}{" "}
        //                 × {p.quantity}
        //               </div>
        //             ))}
        //           </td>

        //           {/* Amount */}
        //           <td className="px-4 py-2 border font-semibold whitespace-nowrap">
        //             ₹{order.amount?.toLocaleString("en-IN")}
        //           </td>

        //           {/* Status */}
        //           <td className="px-4 py-2 border">
        //             <span
        //               className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
        //                 order.status === "Paid"
        //                   ? "bg-green-100 text-green-700"
        //                   : order.status === "Pending"
        //                   ? "bg-yellow-100 text-yellow-700"
        //                   : "bg-red-100 text-red-700"
        //               }`}
        //             >
        //               {order.status}
        //             </span>
        //           </td>

        //           {/* Date */}
        //           <td className="px-4 py-2 border whitespace-nowrap">
        //             {order.createdAt
        //               ? new Date(
        //                   order.createdAt
        //                 ).toLocaleDateString("en-IN")
        //               : "N/A"}
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
        <div className="w-full">
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border">Order ID</th>
                  <th className="px-4 py-3 border">User</th>
                  <th className="px-4 py-3 border">Products</th>
                  <th className="px-4 py-3 border">Amount</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    {/* Order ID */}
                    <td className="px-4 py-3 border break-all">{order._id}</td>

                    {/* User */}
                    <td className="px-4 py-3 border">
                      <span className="text-xs text-gray-500">
                        {order.user?.email || "N/A"}
                      </span>
                    </td>

                    {/* Products */}
                    <td className="px-4 py-3 border">
                      {order.products?.map((p, idx) => (
                        <div key={idx} className="mb-1">
                          {p.productId?.productName || "N/A"} × {p.quantity}
                        </div>
                      ))}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 border font-semibold whitespace-nowrap">
                      ₹{order.amount?.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 border whitespace-nowrap">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded-xl p-4 flex flex-col gap-5 mx-3 shadow-lg bg-white"
              >
                {/* Order ID */}
                <div className="flex justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>

                    <p className="text-sm font-medium break-all">{order._id}</p>
                  </div>

                  {/* Status */}
                  <span
                    className={`h-fit px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* User */}
                <div className="border-t pt-3 mb-3">
                  <p className="text-xs text-gray-500">User</p>
                  <p className="text-sm text-gray-500 break-all">
                    {order.user?.email || "N/A"}
                  </p>
                </div>

                {/* Products */}
                <div className="border-t pt-3 mb-3">
                  <p className="text-xs text-gray-500 mb-2">Products</p>

                  <div className="flex flex-col gap-2">
                    {order.products?.map((p, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-sm font-medium">
                          {p.productId?.productName || "N/A"}
                        </p>

                        <p className="text-xs text-gray-500">
                          Quantity: {p.quantity}
                        </p>

                        <p className="text-xs text-gray-500">
                          Price: ₹
                          {p.productId?.productPrice?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount + Date */}
                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>

                    <p className="font-bold">
                      ₹{order.amount?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Date</p>

                    <p className="text-sm">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
