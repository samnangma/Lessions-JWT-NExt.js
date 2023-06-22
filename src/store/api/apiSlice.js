import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  logout,
  setCredentials,
  setCurrentUser,
} from "../features/auth/authSlice";
import { getUnencryptedRefreshToken } from "@/lib";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mbanking.istad.co/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshToken = await getUnencryptedRefreshToken();
    console.log("resfreshToken in apiSlice", refreshToken);
    if (refreshToken) {
      try {
        const response = await fetch(
          "https://mbanking.istad.co/api/v1/auth/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );
        const resultResponse = await response.json();
        console.log("response", resultResponse);

        if (resultResponse.code === 200) {
          api.dispatch(setCredentials(resultResponse.data));

          // set user data
          const userResponse = await fetch(
            "https://mbanking.istad.co/api/v1/auth/me",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${resultResponse.data.accessToken}`,
              },
            }
          );
          const userResult = await userResponse.json();
          console.log("userResult", userResult);
          api.dispatch(setCurrentUser(userResult));
          result = await baseQuery(args, api, extraOptions);
        } else if (resultResponse.code === 401) {
          api.dispatch(logout());
          alert("Your session has expired. Please login again.");
        }
      } catch (error) {
        console.error("Failed to refresh access token", error);

        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
      alert("Your session has expired. Please login again.");
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
