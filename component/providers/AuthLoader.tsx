"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthReady, setUser } from "@/redux/authSlice";
import axios from "axios";

export function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch current user from /api/me
        // This will return user info if valid JWT exists in cookies
        const response = await axios.get("/api/me", {
          withCredentials: true,
        });

        if (response.data) {
          // Set user in Redux with full user info (including role)
          dispatch(setUser(response.data));
        }
      } catch (error: any) {
        // No valid session, user will be null
        console.debug("No active session");
      } finally {
        // Mark auth as ready (whether user is logged in or not)
        dispatch(setAuthReady(true));
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
}