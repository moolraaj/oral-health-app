import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, { page?: number; limit?: number; role?: string }>({
      query: ({ page = 1, limit = 10, role }) => {
        const params: any = { page, limit };
        if (role) params.role = role;
        return {
          url: '/api/auth/users',
          params,
        };
      },
      providesTags: ['User'],
      keepUnusedDataFor: 60,
    }),
  }),
  
});

export const { useGetUsersQuery } = userApi;
