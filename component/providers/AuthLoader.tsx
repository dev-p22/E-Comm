"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAuthReady } from "@/redux/authSlice";

export function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }

    dispatch(setAuthReady(true));
  }, [dispatch]);

  return null;
}