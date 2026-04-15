"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Layout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  

  useEffect(()=>{
    if(!user){
      router.push("/login");
    }
  },[user])

  return <div className="w-full h-screen">{children}</div>;
}

export default Layout;
