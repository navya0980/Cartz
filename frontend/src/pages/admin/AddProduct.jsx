import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";


const AddProduct = () => {
  const accessToken=localStorage.getItem("accessToken");
  const Products=useSelector((store)=>store.product);
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);

  const [productData,setProductData]=useState({
    productName:"",
    productPrice:"",
    productDesc:"",
    brand:"",
    category:"",
    productImg:[]
  })

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setProductData((prev)=>({...prev,[name]:value}));
  }

  const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("productName", productData.productName);
  formData.append("productPrice", productData.productPrice);
  formData.append("productDesc", productData.productDesc);
  formData.append("category", productData.category);
  formData.append("brand", productData.brand);

  if (productData.productImg.length === 0) {
    toast.error("Please select at least one image");
    return;
  }

  productData.productImg.forEach((img) => {
    formData.append("files", img);
  });

  try {
    setLoading(true);
    const res = await axios.post(
      "http://localhost:8000/product/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if(res.data.success){
      toast.success(res.data.message);
      dispatch(setProducts([...Products,res.data.product]))

    }
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }finally{
    setLoading(false);
  }
};

  return (
    <div className=" md:pl-[350px] py-1  md:pr-10 mx-auto  bg-gray-100">
      <Card className="w-full flex-col gap-10 my-20">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label className="font-semibold">Product Name</Label>
              <Input
                type="text"
                name="productName"
                placeholder="Ex-IPhone"
                onChange={handleChange}
                value={productData.productName}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-semibold">Price</Label>
              <Input
                type="number"
                name="productPrice"
                placeholder=""
                required
                onChange={handleChange}
                value={productData.productPrice}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label className="font-semibold">Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Ex-Samsung"
                  required
                  onChange={handleChange}
                value={productData.brand}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Category</Label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Ex-Electronics"
                  required
                  onChange={handleChange}
                value={productData.category}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Description</Label>

              <Textarea
                name="productDesc"
                placeholder="Enter brief description of product"
                onChange={handleChange}
                value={productData.productDesc}
              />
            </div>
            <ImageUpload productData={productData} setProductData={setProductData}/>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2"  >
          <Button 
          disabled={loading}
          onClick={submitHandler} className="bg-accent-600 w-full hover:bg-primary-600 cursor-pointer h-10 font-semibold hover:opacity-85" type="submit">{loading? < span className="flex gap-1 items-center"><Loader2 className="animate-spin"/></span>:"Add Product"}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProduct;
