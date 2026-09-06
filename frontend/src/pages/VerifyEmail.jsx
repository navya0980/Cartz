import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect ,useState } from "react";
import { useParams } from "react-router-dom";
const VerifyEmail=()=>{
    const {token}=useParams();
    
    const [status,setStatus]=useState("Verifying...");
    const navigate=useNavigate();
    const verifyEmail=async()=>{
        try {
            const res=await axios.post("http://localhost:8000/user/verify",{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.data.success){
                setStatus("✅ Email verified successfully..");
                setTimeout(()=>{
                  navigate("/login");
                },2000);
            }
        } catch (error) {
            console.log(error);
            setStatus("❌Verification failed")
        }
    }

    useEffect(()=>{
         verifyEmail();
    },[token]);

    return (
        <div className="relative w-full h-[760px] overflow-hidden">
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
                    <h2 className="text-xl font-semi-bold text-gray-800">{status}</h2>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail;