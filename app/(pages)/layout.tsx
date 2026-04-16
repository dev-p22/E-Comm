"use client";

import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  // Route protection is handled by middleware.ts
  // No need for client-side redirects to avoid hydration mismatch
  return <div className="w-full h-screen">{children}</div>;
}

export default Layout;
