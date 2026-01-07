import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    status: string;
    code: number;
    message: string;
    data: {
        token: string;
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://lavishly-fogless-sang.ngrok-free.dev/api/v1/auth",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;
