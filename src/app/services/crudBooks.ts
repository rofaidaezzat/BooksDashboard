import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { GetBooksResponse, GetBooksParams, IBook } from '../../types/books';

// Define types for Create/Update that were inline or missing
export interface CreateBookRequest {
    name: string; // Legacy field mapping, will check if UI sends 'title' or 'name'
    title: string;
    description?: string;
    price: number;
    image: File; // Changed to single file as per API implication, assuming file upload
    category?: string;
    stock?: number;
}

export interface UpdateBookRequest {
    title?: string;
    description?: string;
    price?: number;
    image?: File;
}

// --- API Slice ---
export const booksApiSlice = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api-knowledge-think.vercel.app/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            headers.set('ngrok-skip-browser-warning', 'true');
            return headers;
        }
    }),
    tagTypes: ['Books'],
    endpoints: (builder) => ({

        // ----------------- GET /books --------------------
        getAllBooks: builder.query<GetBooksResponse, GetBooksParams | void>({
            query: (params) => {
                const { page = 1, limit = 10, sort = '-createdAt', keyword } = params ?? {};
                const searchParams = new URLSearchParams();
                searchParams.set('page', String(page));
                searchParams.set('limit', String(limit));
                if (sort) {
                    searchParams.set('sort', sort);
                }
                if (keyword) {
                    searchParams.set('keyword', keyword);
                }
                return `api/v1/books?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Books' as const, id: _id })),
                        { type: 'Books', id: 'LIST' },
                    ]
                    : [{ type: 'Books', id: 'LIST' }],
        }),

        // ----------------- POST /books ------------------
        // Keeping vague types for now as create endpoint wasn't provided in detail, but aligning with `title`
        createBook: builder.mutation<IBook, FormData>({
            query: (formData) => ({
                url: 'api/v1/books',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Books', id: 'LIST' }],
        }),

        // ----------------- PATCH /books/:id ---------------------
        updateBook: builder.mutation<IBook, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `api/v1/books/${id}`,
                method: 'PATCH',
                body: body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
        }),

        // ----------------- GET /books/:id ---------------------
        getBookById: builder.query<IBook, string>({
            query: (id) => `api/v1/books/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Books', id }],
        }),

        //------------------- DELETE /books/:id ---------------------
        deleteBook: builder.mutation<{ status: string; code: number; message: string }, string>({
            query: (id) => ({
                url: `api/v1/books/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
        })
    }),
});

// --- Export Hooks ---
export const {
    useGetAllBooksQuery,
    useGetBookByIdQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = booksApiSlice;

