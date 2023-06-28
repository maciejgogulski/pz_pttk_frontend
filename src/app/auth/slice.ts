/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from './types'
import { login } from './thunk'

const INITIAL_STATE: State = {
  token: undefined,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    SET_TOKEN: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    UNSET_TOKEN: (state) => {
      state.token = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        console.log(action)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        console.log(action)
      })
  },
})

export default authSlice
