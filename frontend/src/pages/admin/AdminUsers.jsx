import axios from "axios";
import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Eye } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const navigate=useNavigate();

  const filteredUsers = users.filter((user) =>
  `${user.firstName} ${user.lastName}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
);

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        "http://localhost:8000/user/all-users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
  <div className="md:pl-[350px] py-20 pl-5 md:py-10 pr-20 mx-auto ">
    <h1 className="font-bold text-2xl">User Management</h1>
    <p>View and manage registered users</p>

    <div className="flex relative w-[300px] mt-6">
      <Search className="absolute left-2 top-1 text-gray-600 w-5" />
      <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10" placeholder="Search Users..." />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-7">
  {filteredUsers.map((user, index) => {
    return (
      <div
        key={index}
        className="bg-primary-100 p-6 flex flex-col gap-5 rounded-lg min-w-0"
      >
        {/* User info */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={user?.profilePic || UserLogo}
            alt=""
            className="rounded-full w-16 h-16 shrink-0 object-cover border border-pink-600"
          />

          <div className="min-w-0">
            <h1 className="font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </h1>

            <h3 className="truncate">
              {user?.email}
            </h3>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-3">
          <Button
            className="flex-1 min-w-[120px] cursor-pointer"
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/users/${user?._id}`)
            }
          >
            <Edit />
            Edit
          </Button>

          <Button
            className="flex-1 min-w-[120px] cursor-pointer"
            onClick={() =>
              navigate(`/dashboard/users/orders/${user?._id}`)
            }
          >
            <Eye />
            Show Order
          </Button>
        </div>
      </div>
    );
  })}
</div>
  </div>
);
};

export default AdminUsers;