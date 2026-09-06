import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Edit, Edit2, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  }

  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // Add existing images public_ids
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await axios.put(
        `http://localhost:8000/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product updated successfully");
        setOpen(false);
        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );

        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );

      const res = await axios.delete(
        `http://localhost:8000/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="md:pl-[350px] pl-5  py-20 pr-10 md:py-10 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex space-y-2 flex-wrap justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="Search Product..."
            className="md:w-[400px] w-[200px] items-center"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort By Price" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="lowToHigh">Price : Low To High</SelectItem>
            <SelectItem value="highToLow">Price : High To Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4 py-3 my-2">
            <div className="flex flex-wrap items-center gap-4">
              {/* Product Image + Name */}
              <div className="flex items-center gap-4 flex-1 min-w-[220px]">
                <img
                  src={product.productImg[0].url}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shrink-0"
                  alt={product.productName}
                />

                <h1 className="font-bold text-md text-gray-700 min-w-0 break-words">
                  {product.productName}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-center min-w-[100px]">
                <h1 className="font-bold text-xl text-gray-800">
                  ₹{product.productPrice.toLocaleString("en-IN")}
                </h1>
              </div>

              {/* Actions */}
              <div className="flex gap-5 shrink-0">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit
                      onClick={() => {
                        setOpen(true);
                        setEditProduct(product);
                      }}
                      className="text-green-500 cursor-pointer"
                    />
                  </DialogTrigger>

                  {/* Your DialogContent remains the same */}
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>

                  {/* Your AlertDialogContent remains the same */}
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
