import React from "react";

const Verify=()=>{
    return(
      <div className="relative w-full height-[760px] overflow-Hidden">
        <div className="min-h-screen flex justify-center items-center bg-transparent px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl mb-4 font-semibold text-green-500"><i class="fa-solid fa-square-check"></i>Check your Email</h2>
            <p className="text-gray-400 text-sm">We've sent you an email to verify your account.Please check your inbox and click the verification link.</p>
          </div>
        </div>
      </div>
    )
}
export default Verify;