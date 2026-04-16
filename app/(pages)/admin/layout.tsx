"use client";

import Navbar from "@/component/common/Navbar";
import NotAuthorize from "@/component/common/NotAuthorize";
import React from "react";
import { useSelector } from "react-redux";

function Layout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.auth.user);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);

  // Wait for auth to be ready before rendering (prevents hydration mismatch)
  if (!isAuthReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Middleware already protects this route, but check role for UX
  if (!user || user.role !== "admin") {
    return <NotAuthorize />;
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
