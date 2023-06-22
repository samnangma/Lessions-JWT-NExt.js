import { apiSlice } from "@/store/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => `/auth/me`,
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;


