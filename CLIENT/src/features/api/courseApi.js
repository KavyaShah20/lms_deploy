import CreateLecture from "@/Pages/admin/lecture/CreateLecture";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "https://lms-deployed-npsx.onrender.com/api/v1/course"

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getSearchCourses: builder.query({
            query: ({ searchQuery, categories, SortByPrice }) => {
                //build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

                //append category
                if (categories && categories.length > 0) {
                    const categoriesString = categories.map(encodeURIComponent).join(",");
                    queryString += `&categories=${categoriesString}`
                }
                if (SortByPrice) {
                    queryString += `&SortByPrice=${encodeURIComponent(SortByPrice)}`
                }

                return {
                    url: queryString,
                    method: "GET",
                }
            }
        }),
        getPublishCourse: builder.query({
            query: () => ({
                url: "/published-courses",
                method: "GET",
            })
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course'],
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course'],
        }),
        removeCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "DELETE",
            }),
        }),
        createLecture: builder.mutation({
            query: ({ courseId, lectureTitle }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle },
            }),
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ['Refetch_Lecture'],
        }),
        editLecture: builder.mutation({
            query: ({ courseId, lectureId, lectureTitle, videoInfo, isPreviewFree }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree },
            }),

        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Refetch_Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET",
            }),
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH",
            }),
        }),
    }),
})

export const {
    useCreateCourseMutation,
    useGetPublishCourseQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useRemoveCourseMutation,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useGetSearchCoursesQuery,
} = courseApi;