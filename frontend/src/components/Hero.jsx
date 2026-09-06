import React from "react";
import { Button } from "@/components/ui/button"; // your Button component
 const Hero=()=>{
    return (
        <section className="bg-gradient-to-r from-primary-900 to-primary-50
        text-white py-16 my-3">
           <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Latest electronics at Best Prices</h1>
                    <p className="text-xl mb-6 text-blue-100">
                        Discover cutting edge technology with unbeatable deals on smartphones,laptops and more
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-white text-primary-700 font-semibold hover:bg-gray-100 p-4 cursor-pointer text-md">Shop Now</Button>
                        <Button variant="outline" className="border-white font-semibold text-white p-4 bg-transparent text-md hover:bg-[#ffffff] hover:text-[#c9184a] cursor-pointer">View Deals</Button>
                    </div>
                </div>
                <div className="realtive">
                    <img src="/hero2.webp"  alt="" className=""/>
                </div>
            </div>
           </div>
        </section>
    )
 }

 export default Hero;