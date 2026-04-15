"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

function Layout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.auth.user);
    const router = useRouter();

  if(user){
    return router.push("/");
  }

  return <div>{children}</div>;
}

export default Layout;
