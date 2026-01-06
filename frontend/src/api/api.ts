import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000',
    }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query<any[], void>({
            query: () => '/api/todos',
            providesTags: ['Todos'],
        }),
        postTodos: builder.mutation<any, { text: string }>({
            query: (body) => ({
                url: '/api/todos',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Todos'],
        }),
        deleteTodo: builder.mutation<any, { id: number }>({
            query: ({ id }) => ({
                url: `/api/todos/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todos'],
        }),
        changeTodo: builder.mutation<any, { id: number; text?: string; completed?: boolean }>({
            query: ({ id, ...body }) => ({
                url: `/api/todos/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Todos'],
        }),
    }),
});

export const { useGetTodosQuery, usePostTodosMutation, useDeleteTodoMutation, useChangeTodoMutation } = api;