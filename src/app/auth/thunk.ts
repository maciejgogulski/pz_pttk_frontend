import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import Slice from './slice'

export const login = createAsyncThunk(
  `${Slice.name}/LOGIN`,
  () => axios.get<any>('https://my-json-server.typicode.com/typicode/demo/posts'),
)
