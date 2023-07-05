/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State as StateType } from './types'
import { RootState } from '../store'

const INITIAL_STATE: StateType = {
  token: undefined,
}

const slice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    logOut: (state) => {
      state.token = undefined
    },
  },
})

export const { setCredentials, logOut } = slice.actions

export default slice

export const getToken = (state: RootState) => state.auth.token
