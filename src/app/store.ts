import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import api from './api'
import auth from './auth'

const store = configureStore({
  reducer: {
    [api.slice.reducerPath]: api.slice.reducer,
    [auth.slice.name]: auth.slice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.slice.middleware),
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
