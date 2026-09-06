import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setCart } from "@/redux/productSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/user/login`,
        formData,
      );
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);

        const cartRes = await axios.get(`${import.meta.env.VITE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${res.data.accessToken}`,
          },
        });

        dispatch(setCart(cartRes.data.cart));
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message;
      if (message == "User not found") {
        navigate("/signup");
        toast.error("User not found please sign in!!");
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-2/3 max-w-sm grid-cols gap-9 s-card">
        <CardHeader>
          <CardTitle className="text-primary-900 font-bold ">
            Login to your account
          </CardTitle>
          <CardDescription>Enter below details to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-3  text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full h-10 font-semibold hover:bg-accent-50 hover:border-accent-700 hover:text-accent-700
            
             cursor-pointer bg-accent-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
          <p className="text-gray-700 text-sm">
            Don't have an account?
            <Link
              to="/signup"
              className="hover:underline cursor-pointer text-accent-700 ml-1"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
