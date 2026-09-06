import React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const ProductCard = ({ product, loading,user }) => {
  const { productName, productImg, productPrice } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      let errorMessage = error.response.data.message;
      if (errorMessage == "Access token is missing or invalid") {
        navigate("/login");
        toast.error("Login is required");
      } else toast.error(error.response.data.message);
    }
  };

  return (
    <div className="shadow-lg bg-gray-100 rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square cursor-pointer overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            onClick={()=>navigate(`/products/${product._id}`)}
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full  transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 bg-gray-200 my-2 space-y-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[150px] h-8" />
        </div>
      ) : (
        <div className="px-2 py-1 bg-gray-100 my-3 space-y-2">
          <div className="font-semibold text-sm line-clamp-2">
            {productName}
          </div>
          <h2 className="flex gap-5 items-center"><span className="font-bold">₹{productPrice}</span></h2>
          
            <Button
              onClick={() => addToCart(product._id)}
              className="w-full py-2 my-1 cursor-pointer hover:border-accent-600 hover:text-accent-600 hover:bg-white font-semibold bg-accent-600"
            >
              <ShoppingBag /> Add to Cart
            </Button>
          
        </div>
      )}
    </div>
  );
};

export default ProductCard;
