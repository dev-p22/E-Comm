"use client";

import Navbar from "@/component/common/Navbar";
import NotAuthorize from "@/component/common/NotAuthorize";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Layout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.auth.user);

  if (!user || user.role !== "admin") {
    return <NotAuthorize />;
  }
  

  return (<div className="w-full h-screen">
    <Navbar/>
    {children}
    </div>
    )
}

export default Layout;
