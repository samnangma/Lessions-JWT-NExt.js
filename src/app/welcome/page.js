"use client";

import { getUnencryptedRefreshToken, removeRefreshToken } from "@/lib";
import { setCurrentUser } from "@/store/features/auth/authSlice";
import { useGetUserQuery } from "@/store/features/user/userApiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Welcome() {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery();
  const data = useSelector((state) => state);
  console.log("data", data);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      console.log("user", user);
      dispatch(setCurrentUser(user));
    }
  }, []);

  // removeRefreshToken()

  console.log("user", user);

  let content = null;
  if (isLoading) {
    content = (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        Loading...
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        Welcome {user.data.name}
        
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        Error: {error.message}
      </div>
    );
  }

  return content;
}
