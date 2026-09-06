import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <OrderCard userOrder={userOrder}/>
  );
};

export default MyOrder;