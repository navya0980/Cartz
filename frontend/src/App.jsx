import React from "react";
import { Button } from "./components/ui/button";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import "./App.css";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { useEffect } from "react";
import { setUser } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";


const router=createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/><Home/><Footer/></>
  },
  {
    path:'/signup',
    element:<><Navbar/><Signup/></>
  },
  {
    path:'/login',
    element:<><Navbar/><Login/></>
  },
  {
    path:'/verify',
    element:<Verify/>
  },
  {
    path:'/verify/:token',
    element:<VerifyEmail/>
  },
  {
    path:'/profile/:userId',
    element:<ProtectedRoute><Navbar/><Profile/></ProtectedRoute>
  },
  {
    path:'/products',
    element:<><Navbar/><Products/></>
  },
  {
    path:'/products/:id',
    element:<><Navbar/><SingleProduct/></>
  },
  {
    path:'/cart',
    element:<ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
  },
  {
    path:'/address',
    element:<ProtectedRoute><Navbar/><AddressForm/></ProtectedRoute>
  },
  {
    path:'/order-success',
    element:<ProtectedRoute><Navbar/><OrderSuccess/></ProtectedRoute>
  },
  {
    path:'/dashboard',
    element:<ProtectedRoute adminOnly={true}><Navbar/><Dashboard/></ProtectedRoute>,
    children:[
      {
       path:"sales",
       element:<AdminSales/>
      },
      {
       path:"add-product",
       element:<AddProduct/>
      },
      {
       path:"products",
       element:<AdminProduct/>
      },
      {
       path:"orders",
       element:<AdminOrders/>
      },
      {
       path:"users",
       element:<AdminUsers/>
      },
      {
       path:"users/:id",
       element:<UserInfo/>
      },
      {
       path:"users/orders/:userId",
       element:<ShowUserOrders/>
      },
    ]
  },
  
  
])
function App(){
  const dispatch=useDispatch();

  useEffect(() => {
    const getUser = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) return;
       
        try {
            const res = await axios.get("http://localhost:8000/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
           
            
            dispatch(setUser(res.data.user));
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    getUser();
}, []);

  return (
   <>
   <RouterProvider router={router}/>
  </>
  )
}

export default App;