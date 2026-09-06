import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react"; // icons
import { Button } from "@/components/ui/button"; // your Button component
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { store } from "@/redux/store.js";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { UserRoundCog } from "lucide-react";

const Navbar = () => {
  const accessToken = localStorage.getItem("accessToken");
  let { user } = useSelector((store) => store.user);
  let {cart}=useSelector((store)=>store.product);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin=user?.role==="admin"?true:false;

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        dispatch(setCart([]));
        localStorage.removeItem("accessToken")
        toast.success(res.data.message);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401 || status === 403 || message === "User not found"||message==="Access token is missing or invalid") {
        dispatch(setUser(null));
        navigate("/login");
        return;
      }

      toast.error(message || "Something went wrong login again ");
      
    }
  };

  return (
    <header className="bg-primary-800  sticky top-1 z-50 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8 ">
        {/* Logo Section */}

        <div>
          <img
            src="/logo.png"
            alt="Cartz Logo"
            className="h-[60px] bg-transparent"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-12 text-[1.3rem] items-center ">
          <ul className="flex gap-12 items-center ">
            <Link to="/" className="transition-colors nav-link">
              Home
            </Link>
            <Link to="/products" className=" transition-colors nav-link">
              Products
            </Link>
            {user && (
              <Link
                to={`/profile/${user._id}`}
                className=" transition-colors flex gap-2 items-center nav-link"
              >
                Hello,{user.firstName}
                <UserRoundCog />
              </Link>
            )}
            {admin && (
              <Link
                to='/dashboard/sales'
                className=" transition-colors flex gap-2 items-center nav-link"
              >
               Dashboard
              </Link>
            )}
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="relative   mx-3  transition-colors">
            <ShoppingCart size={24} />
            <span className="bg-white rounded-full absolute text-primary-700 -top-2 -right-3 px-2 text-sm font-bold">
              {cart?.items?.length||0}
            </span>
          </Link>

          {/* Login / Logout */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-white p-3 mx-3 text-primary-700  transition-colors cursor-pointer hover:bg-primary-100"
               
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-white p-3 mx-3 text-primary-700 hover:bg-primary-100 transition-colors cursor-pointer"
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-100 px-4 pt-2 pb-4 space-y-2">
          <ul className="flex flex-col gap-5 text-[1.1rem] font-semibold text-black">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <li className=" transition-colors hover:opacity-[0.9]">Home</li>
            </Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>
              <li className=" transition-colors">Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`} onClick={() => setIsOpen(false)}>
                <li className=" transition-colors">Hello,{user.firstName}</li>
              </Link>
            )}
            {admin && (
              <Link to='/dashboard/sales' onClick={() => setIsOpen(false)}>
                <li className="transition-colors">Dashboard</li>
              </Link>
            )}
          </ul>

          {/* Cart and Button */}
          <div className="flex items-center py-3 gap-6 mt-2">
            <Link
              to="/cart"
              className="relative text-primary-700  transition-colors"
            >
              <ShoppingCart size={24} />
              <span className="bg-primary-400 rounded-full absolute text-white -top-2 -right-3 px-2 text-sm font-bold">
                {cart?.items?.length||0}
              </span>
            </Link>

            {user ? (
              <Button className="bg-primary-600 text-white hover:bg-primary-500 transition-colors cursor-pointer"
              onClick={() => {
                navigate("/logout");
              }}
              >
                Logout
              </Button>
            ) : (
              <Button className="bg-primary-600 text-white hover:bg-primary-500 transition-colors cursor-pointer" onClick={() => {
                navigate("/login");
              }}>
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
