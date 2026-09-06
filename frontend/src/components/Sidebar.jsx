import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Users,
  Menu,
  X,
} from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    {
      to: "/dashboard/sales",
      icon: <LayoutDashboard />,
      name: "Dashboard",
    },
    {
      to: "/dashboard/add-product",
      icon: <PackagePlus />,
      name: "Add Product",
    },
    {
      to: "/dashboard/products",
      icon: <PackageSearch />,
      name: "Products",
    },
    {
      to: "/dashboard/users",
      icon: <Users />,
      name: "Users",
    },
    {
      to: "/dashboard/orders",
      icon: <FaRegEdit />,
      name: "Orders",
    },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div
        className="
          hidden md:block
          fixed left-0 top-24
          w-[300px]
          h-[calc(100vh-4rem)]
          border-r border-accent-200
          bg-accent-50
          py-3 px-10
        "
      >
        <div className="text-center pt-6 px-3 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-xl ${
                  isActive
                    ? "bg-accent-600 text-gray-200"
                    : "bg-transparent"
                }
                flex items-center gap-2
                font-bold cursor-pointer
                p-3 rounded-2xl w-full`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        onClick={() => setOpen(true)}
        className="
          md:hidden
          fixed
          top-28
          left-4
          z-40
          p-2
          rounded-lg
          bg-accent-600
          text-white
          shadow-md
        "
      >
        <Menu size={24} />
      </button>

      {/* ================= MOBILE OVERLAY + SIDEBAR ================= */}
      {open && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className="
              md:hidden
              fixed inset-0
              bg-black/40
              z-40
            "
          />

          {/* Mobile Sidebar */}
          <div
            className="
              md:hidden
              fixed
              left-0
              top-24
              z-50
              w-[280px]
              h-[calc(100vh-4rem)]
              bg-accent-50
              border-r border-accent-200
              p-6
            "
          >
            {/* Close button */}
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)}>
                <X
                  size={24}
                  className="cursor-pointer"
                />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-lg ${
                      isActive
                        ? "bg-accent-600 text-gray-200"
                        : "bg-transparent"
                    }
                    flex items-center gap-3
                    font-bold
                    p-3 rounded-2xl w-full`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;