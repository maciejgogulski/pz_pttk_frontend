import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../services/backend/AxiosInstance'
import Slice from './slice'
import { LoginDto } from './dto'

export const login = createAsyncThunk(
  `${Slice.name}/login`,
  async (data: LoginDto) => {
    const response = await axiosInstance().post<{ token: string }>('auth/login', data)
    const responseData = response.data
    return {
      token: responseData.token,
    }
  },
)
