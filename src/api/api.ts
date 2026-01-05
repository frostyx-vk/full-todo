import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '', 
    }),
    // tagTypes: ['User', 'Post'],
    endpoints: (builder) => ({
        getUsers: builder.query<any[], void>({
            query: () => '/api/users',
            // providesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery } = api;