import AuthSlice, { Thunk as AuthThunk } from './auth'

const getActions = (actions: any, thunk: any) => ({
  ...actions,
  thunk: {
    ...thunk,
  },
})

export default {
  auth: getActions(AuthSlice.actions, AuthThunk),
}
