/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from './types'
import { login } from './thunk'

const INITIAL_STATE: State = {
  loading: false,
  token: undefined,
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
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token
      })
      .addCase(login.rejected, () => {
        console.log('Wystapil nieoczekiwany blad')
      })
  },
})

export default authSlice
