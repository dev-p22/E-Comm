"use client";

import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  // Route protection is handled by middleware.ts
  // Auth users are redirected to "/" by middleware
  // No need for client-side redirects to avoid hydration mismatch
  return <div>{children}</div>;
}

export default Layout;
