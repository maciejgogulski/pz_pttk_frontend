import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BACKEND_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).auth
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
})

export default apiSlice
