import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import userImg from "../../assets/user.webp";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const UserInfo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: "",
  });

  const getUserDetails = async () => {
    try {
      let res = await axios.get(
        `http://localhost:8000/user/get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

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
        `http://localhost:8000/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className=" pt-5 min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-10">
            <Button
              onClick={() => navigate(-1)}
              className=" cursor-pointer "
            >
              <ArrowLeft className="w-5 " />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>

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

              <div className="flex gap-3 items-center">
                <Label className="block text-sm font-medium">Role:</Label>

                <RadioGroup value={updateUser?.role}
                onValueChange={(value)=>setUpdateUser({...updateUser,role:value})}
                 className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
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
    </div>
  );
};

export default UserInfo;
