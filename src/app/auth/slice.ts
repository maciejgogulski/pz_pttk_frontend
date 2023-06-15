/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from './types'

const INITIAL_STATE: State = {
  token: 'sdfsdf',
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
})

export default authSlice
