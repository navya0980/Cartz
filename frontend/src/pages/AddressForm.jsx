import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OrderSuccess from "./OrderSuccess";

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
    setFormData({});
  };

  const handlePayment = async () => {
    try {
      // 1. CREATE ORDER IN BACKEND

      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),

          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!data.success) {
        return toast.error("Something went wrong");
      }

      // 2. RAZORPAY OPTION

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        // Razorpay Order ID received from backend
        order_id: data.order.id,

        name: "Cartz",

        description: "Order Payment",

        // 3. PAYMENT SUCCESS HANDLER

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (verifyRes.data.success) {
              toast.success("Payment is Successfull!!");

              // Clear cart
              dispatch(
                setCart({
                  items: [],
                  totalPrice: 0,
                }),
              );

              // Navigate to success page
              navigate("/order-success");
            } else {
              toast.error("❌ Payment Verification failed");
             
            }
          } catch (error) {
            console.error("Payment verification error:", error);

            toast.error("Error verifying payment");
            
          }
        },

        // 4. USER CLOSES RAZORPAY POPUP

        modal: {
          ondismiss: async function () {
            try {
              await axios.post(
                `${import.meta.env.VITE_URL}/orders/verify-payment`,
                {
                  razorpay_order_id: data.order.id,
                  paymentFailed: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                },
              );

              toast.error("Payment Cancelled or Failed");
            } catch (error) {
              console.error(
                "Payment verification error:",
                error.response?.data || error.message,
              );

              toast.error(
                error.response?.data?.message || "Error verifying payment",
              );
            }
          },
        },

        // 5. CUSTOMER DETAILS

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        // 6. RAZORPAY THEME

        theme: {
          color: "#8b5cf6",
        },
      };
      // 7. CREATE RAZORPAY INSTANCE

      const rzp = new window.Razorpay(options);
      // 8. PAYMENT FAILURE EVEN

      rzp.on("payment.failed", async function (response) {
        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          console.error("Payment Failed:", response);

          toast.error("Payment Failed. Please try again.");
        } catch (error) {
          console.error("Payment Failed Error:", error);

          toast.error("Payment Failed. Please try again.");
        }
      });
      // 9. OPEN RAZORPAY PAYMENT WINDO

      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);

      toast.error("Something went wrong with payment");
    }
  };

  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
    }
  }, [addresses]);
  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid md:grid-cols-2 items-start grid-cols-1 justify-center gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 bg-white">
          {showForm ? (
            <>
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>

                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Contact No</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 8970656743"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>

                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>

                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Hyderabad"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>

                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="Telangana"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ZIP + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>

                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="500001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>

                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="w-full my-3 cursor-pointer"
              >
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 ">
                Saved Addresses
                <p
                  onClick={() => {
                    setShowForm(true);
                  }}
                  className="font-bold w-5 h-5 flex items-center justify-center cursor-pointer border bg-black text-white  rounded-sm"
                >
                  +
                </p>
              </h2>

              {addresses.map((addr, index) => {
                return (
                  <div
                    key={index}
                    className={`border p-4 rounded-md cursor-pointer relative ${
                      selectedAddress === index
                        ? "border-accent-600 bg-accent-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => dispatch(setSelectedAddress(index))}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.email}</p>
                    <p>
                      {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                      {addr.country}
                    </p>

                    <button
                      onClick={() => {
                        dispatch(deleteAddress(index));
                      }}
                      className="absolute cursor-pointer top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full  bg-accent-600 hover:bg-primary-600 cursor-pointer"
              >
                Proceed to checkout
              </Button>
            </div>
          )}
        </div>
        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="font-bold">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
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
  );
};

export default AddressForm;
