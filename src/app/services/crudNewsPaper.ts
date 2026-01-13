import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { INewspaper, GetNewspapersResponse, GetNewspapersParams } from "../../types/newspaper";

export const newsPaperApiSlice = createApi({
    reducerPath: "newsPaperApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://knowledge-think-eight.vercel.app/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            headers.set('ngrok-skip-browser-warning', 'true');
            return headers;
        },
    }),
    tagTypes: ["Newspapers"],
    endpoints: (builder) => ({
        // GET /newspapers
        getAllNewspapers: builder.query<GetNewspapersResponse, GetNewspapersParams | void>({
            query: (params) => {
                const { page = 1, limit = 10, sort = "-createdAt", keyword } = params ?? {};
                const searchParams = new URLSearchParams();
                searchParams.set("page", String(page));
                searchParams.set("limit", String(limit));
                if (sort) searchParams.set("sort", sort);
                if (keyword) searchParams.set("keyword", keyword);
                return `api/v1/newspapers?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: "Newspapers" as const, id: _id })),
                        { type: "Newspapers", id: "LIST" },
                    ]
                    : [{ type: "Newspapers", id: "LIST" }],
        }),

        // POST /newspapers
        createNewspaper: builder.mutation<INewspaper, { title: string; description: string }>({
            query: (body) => ({
                url: "api/v1/newspapers",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Newspapers", id: "LIST" }],
        }),

        // PATCH /newspapers/:id
        updateNewspaper: builder.mutation<INewspaper, { id: string; body: { title: string; description: string } }>({
            query: ({ id, body }) => ({
                url: `api/v1/newspapers/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Newspapers", id },
                { type: "Newspapers", id: "LIST" },
            ],
        }),

        // GET /newspapers/:id
        getNewspaperById: builder.query<INewspaper, string>({
            query: (id) => `api/v1/newspapers/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Newspapers", id }],
        }),

        // DELETE /newspapers/:id
        deleteNewspaper: builder.mutation<{ status: string; message: string }, string>({
            query: (id) => ({
                url: `api/v1/newspapers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Newspapers", id },
                { type: "Newspapers", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllNewspapersQuery,
    useCreateNewspaperMutation,
    useUpdateNewspaperMutation,
    useGetNewspaperByIdQuery,
    useDeleteNewspaperMutation,
} = newsPaperApiSlice;
