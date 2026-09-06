import react from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImg from "../assets/user.webp";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);

  const params = useParams();
  const userId = params.userId;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile), // Preview
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // image file for backend
      }
      

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10 bg-gray-100 min-h-screen">
      <Tabs defaultValue="profile" className="max-w-7xl items-center">
        <TabsList>
          <TabsTrigger value="profile" className="cursor-pointer p-3">
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="cursor-pointer p-3">
            Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="mt-4">
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 text-2xl text-gray-800">
                Update Profile
              </h1>
             <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                        {/* profile picture */}
                        <div className="flex flex-col items-center ">
                          <img
                            src={updateUser?.profilePic || userImg}
                            alt="profile"
                            className="w-32 h-32 p-1 rounded-full object-cover border-4 border-primary-800 "
                          />
                          <Label className="mt-4 cursor-pointer h-8 bg-primary-600 whitespace-nowrap text-white font-semibold px-4 py-2 hover:bg-primary-700 rounded-lg">
                            Change Picture
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </Label>
                        </div>
                        {/* profile form */}
                        <form
                          action=""
                          className="space-y-4 shadow-lg p-5 rounded-lg bg-white "
                          onSubmit={handleSubmit}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="block text-sm font-medium">
                                First Name
                              </Label>
                              <input
                                type="text"
                                name="firstName"
                                value={updateUser.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                              />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium">Last Name</Label>
                              <input
                                type="text"
                                name="lastName"
                                value={updateUser.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="block text-sm font-medium">Email</Label>
                            <input
                              type="email"
                              name="email"
                              value={updateUser.email}
                              onChange={handleChange}
                              className="w-full border  rounded-lg px-3 py-2 mt-1 bg-gray-50  cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="block text-sm font-medium">
                                Mobile Number
                              </Label>
                              <input
                                type="text"
                                name="phoneNo"
                                onChange={handleChange}
                                value={updateUser.phoneNo}
                                placeholder="Enter your Contact number"
                                className="w-full border rounded-lg px-3 py-2 mt-1  "
                              />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium">City</Label>
                              <input
                                type="text"
                                name="city"
                                value={updateUser.city}
                                onChange={handleChange}
                                placeholder="Enter your City"
                                className="w-full border rounded-lg px-3 py-2 mt-1  "
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="block text-sm font-medium">Address</Label>
                            <input
                              type="text"
                              name="address"
                              onChange={handleChange}
                              value={updateUser.address}
                              placeholder="Enter your Address"
                              className="w-full border rounded-lg px-3 py-2 mt-1  "
                            />
                          </div>
                          
                            <div>
                              <Label className="block text-sm font-medium">Zip Code</Label>
                              <input
                                type="text"
                                name="zipCode"
                                value={updateUser.zipCode}
                                onChange={handleChange}
                                placeholder="Enter your Zip Code"
                                className="w-full border rounded-lg px-3 py-2 mt-1  "
                              />
                            </div>
                            
                         
                          <Button
                            className="w-full h-8 transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-lg mt-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold py-2 rounded-lg "
                            type="submit"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="animate-spin" /> Updating...
                              </>
                            ) : (
                              "Update Profile"
                            )}
                          </Button>
                        </form>
                      </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
