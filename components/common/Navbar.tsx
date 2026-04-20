"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CartSidebar from "../CartSidebar";
import { logoutUser } from "@/services/authServices";

export default function Navbar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      
      await logoutUser();

      // Clear Redux state
      dispatch(logout());
      setOpen(false);

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800">
          E-Com
        </Link>

        <div className="flex items-center gap-4">
            
            <div className="relative cursor-pointer" onClick={()=>setOpenCart(true)}>
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer" />
      </div>

      <CartSidebar openCart={openCart} setOpenCart={setOpenCart} user={user}/>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40" >
              
              <DropdownMenuItem onClick={() => router.push("/")}>
                Home
              </DropdownMenuItem>

              {user?.role === "admin" && (
                <DropdownMenuItem onClick={()=>router.push("/admin/addproduct")}>
                  Add Product
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => setOpen(true)}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Are you sure you want to logout?
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
