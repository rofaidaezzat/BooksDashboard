import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { GetBooksResponse, GetBooksParams } from '../../types/books';



// --- API Slice ---
export const contactusApiSlice = createApi({
    reducerPath: 'contactusApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://knowledge-think-eight.vercel.app/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            headers.set('ngrok-skip-browser-warning', 'true');
            return headers;
        }
    }),
    tagTypes: ['Messages'],
    endpoints: (builder) => ({

        // ----------------- GET /contact-us --------------------
        getAllmessage: builder.query<GetBooksResponse, GetBooksParams | void>({
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
                return `api/v1/contact-us?${searchParams.toString()}`;
            },
            transformResponse: (response: any) => {
                // The API returns { data: { data: [...], pagination: {...} } }
                // We need to flatten it to match GetBooksResponse structure
                return {
                    status: response.status || 'success',
                    code: response.code || 200,
                    message: response.message || '',
                    results: response.data?.results || 0,
                    data: response.data?.data || [],
                    pagination: response.data?.pagination || {}
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Messages' as const, id: _id })),
                        { type: 'Messages', id: 'LIST' },
                    ]
                    : [{ type: 'Messages', id: 'LIST' }],
        }),





        //------------------- DELETE /contact-us/:id ---------------------
        deleteMessage: builder.mutation<{ status: string; code: number; message: string }, string>({
            query: (id) => ({
                url: `api/v1/contact-us/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Messages', id }, { type: 'Messages', id: 'LIST' }],
        })
    }),
});


export const {
    useGetAllmessageQuery,
    useDeleteMessageMutation,

} = contactusApiSlice;
