import React, { useEffect } from "react";
import userLogo from "../assets/user.webp";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";


const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const accessToken=localStorage.getItem("accessToken");
  let API=`${import.meta.env.VITE_URL}/cart`;

  const loadCart=async()=>{
    try {
      let res=await axios.get(`${API}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }
    )
    if(res.data.success){
      dispatch(setCart(res.data.cart));
    }
   } catch (error) {
    toast.error(error.response.data.message);
   }
  }

  const handleUpdateQuantity=async(productId,type)=>{
   try {
      let res=await axios.put(`${API}/update`,{productId,type},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }
    )
    if(res.data.success){
      dispatch(setCart(res.data.cart));
    }
   } catch (error) {
    toast.error(error.response.data.message);
   }
  }

  const removeItem = async (productId) => {
  try {
    const res = await axios.delete(`${API}/remove`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        productId,
      },
    });

    if (res.data.success) {
      dispatch(setCart(res.data.cart));
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};
useEffect(()=>{
 loadCart();
},[dispatch]);

  const subTotal = cart?.totalPrice;
  const shipping = subTotal > 299 ? 0 : 10;
  const tax = subTotal * 0.05;
  const total = subTotal + shipping + tax;

  return (
    <div className="pt-8 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>

          <div className="max-w-7xl flex flex-wrap gap-10 mx-auto">
            <div className="flex flex-col gap-5  grow-1" >
              {cart?.items?.map((product, index) => {
                return (
                  <Card key={index} className="flex-1 m-2">
                    <div className="flex flex-wrap  justify-between    items-center px-7">
                      <div className="flex items-center gap-3 w-[350px]">
                        <img
                          src={
                            product?.productId?.productImg?.[0]?.url || userLogo
                          }
                          alt=""
                          className="w-25 h-25"
                        />

                        <div className="w-[280px] ">
                          <h1 className="font-semibold truncate">
                            {product?.productId?.productName}
                          </h1>
                          <p>₹ {product?.productId?.productPrice}</p>
                        </div>
                      </div>

                      <div className="flex gap-5 items-center">
                        <Button variant="outline" className="cursor-pointer" onClick={()=>handleUpdateQuantity(product?.productId._id,"decrease")}>-</Button>

                        <span>{product?.quantity}</span>

                        <Button variant="outline" className="cursor-pointer" onClick={()=>handleUpdateQuantity(product?.productId._id,"increase")}>+</Button>
                      </div>

                      <p className="font-semibold  ">
                        ₹ {product?.productId?.productPrice * product?.quantity}
                      </p>

                      <p onClick={()=>removeItem(product?.productId?._id)} className="flex text-red-500 items-center gap-1 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex-1">
              <Card className="md:w-[400px]">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal({cart?.items?.length} items)</span>
                    <span>₹ {cart?.totalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹ {shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax(50%)</span>
                    <span>₹ {Math.floor(tax)}</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹ {Math.floor(total)}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" />

                      <Button variant="outline">Apply</Button>
                    </div>

                    <Button onClick={()=>navigate("/address")} className="w-full cursor-pointer hover:bg-primary-600 font-bold bg-accent-600">
                      Place Order
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full font-bold cursor-pointer  hover:bg-primary-600 hover:text-white bg-transparent"
                    >
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm  text-muted-foreground pt-2">
                    <p>* Free shipping on orders over 299</p>
                    <p>* Secure checkout with SSL encryption</p>
                    <p>* 30-days return policy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>

          {/* Title */}
          <h2 className="mt-6 text-2xl font-semibold">Your Cart is Empty</h2>

          <p className="mt-2 text-gray-600">
            Looks like you haven't added any items to your cart yet.
          </p>

          <Button
            onClick={() => navigate("/products")}
            className="mt-6 cursor-pointer font-semibold bg-accent-600 text-white py-3 px-6 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
