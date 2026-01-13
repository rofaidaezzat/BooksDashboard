import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ICourse, GetCoursesResponse, GetCoursesParams } from "../../types/courses";

export const coursesApiSlice = createApi({
    reducerPath: "coursesApi",
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
    tagTypes: ["Courses"],
    endpoints: (builder) => ({
        // GET /courses
        getAllCourses: builder.query<GetCoursesResponse, GetCoursesParams | void>({
            query: (params) => {
                const { page = 1, limit = 10, sort = "-createdAt", keyword } = params ?? {};
                const searchParams = new URLSearchParams();
                searchParams.set("page", String(page));
                searchParams.set("limit", String(limit));
                if (sort) searchParams.set("sort", sort);
                if (keyword) searchParams.set("keyword", keyword);
                return `api/v1/courses?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: "Courses" as const, id: _id })),
                        { type: "Courses", id: "LIST" },
                    ]
                    : [{ type: "Courses", id: "LIST" }],
        }),

        // POST /courses
        createCourse: builder.mutation<ICourse, FormData>({
            query: (formData) => ({
                url: "api/v1/courses",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [{ type: "Courses", id: "LIST" }],
        }),

        // PATCH /courses/:id
        updateCourse: builder.mutation<ICourse, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `api/v1/courses/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Courses", id },
                { type: "Courses", id: "LIST" },
            ],
        }),

        // GET /courses/:id
        getCourseById: builder.query<ICourse, string>({
            query: (id) => `api/v1/courses/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Courses", id }],
        }),

        // DELETE /courses/:id
        deleteCourse: builder.mutation<{ status: string; message: string }, string>({
            query: (id) => ({
                url: `api/v1/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Courses", id },
                { type: "Courses", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useGetCourseByIdQuery,
    useDeleteCourseMutation,
} = coursesApiSlice;
