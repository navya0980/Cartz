import React from 'react'
import { Button} from './ui/button';
import { Input } from './ui/input';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner';

const ProductDesc = ({product}) => {
  const accessToken=localStorage.getItem("accessToken");
  const dispatch=useDispatch();

   const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/cart/add",
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
  <div className="flex flex-col gap-4">
    <h1 className="font-bold text-4xl text-gray-800">
      {product.productName}
    </h1>

    <p className="text-gray-800">
      {product.category} | {product.brand}
    </p>

    <h2 className="text-pink-500 font-bold text-2xl">
      ₹{product.productPrice}
    </h2>

    <p className="line-clamp-12 text-muted-foreground">
      {product.productDesc}
    </p>

    <div className="flex w-full justify-between items-center">
  <Button onClick={()=>addToCart(product._id)} className="w-3/5 cursor-pointer bg-accent-600">
    Add to Cart
  </Button>

  <div className="flex gap-2 items-center">
    <p className="text-gray-800 font-semibold">
      Quantity :
    </p>

    <Input
      type="number"
      className="w-14"
      defaultValue={1}
    />
  </div>
</div>

   
  </div>
);
};

export default ProductDesc;