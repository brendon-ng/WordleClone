import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wordApi = createApi({
  reducerPath: 'word',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://random-word-api.vercel.app',
  }),
  endpoints: (builder) => {
    return {
      fetchWord: builder.query({
        query: () => {
          return {
            url: '/api',
            params: {
              words: 1,
              length: 5,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchWordQuery } = wordApi;
