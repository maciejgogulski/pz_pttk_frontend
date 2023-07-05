import api from '../api'

const apiSlice = api.slice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: {
          ...credentials,
        },
      }),
    }),
  }),
})

const {
  useLoginMutation,
} = apiSlice

export default useLoginMutation
