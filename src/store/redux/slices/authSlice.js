import { createSlice } from '@reduxjs/toolkit'

const storedUser = (() => {
  try {
    const raw = localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: storedUser,
    isLoggedIn: storedUser !== null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.currentUser = action.payload
      state.isLoggedIn = true
      localStorage.setItem('currentUser', JSON.stringify(action.payload))
    },
    logoutSuccess(state) {
      state.currentUser = null
      state.isLoggedIn = false
      localStorage.removeItem('currentUser')
    },
  },
})

export const { loginSuccess, logoutSuccess } = authSlice.actions
export default authSlice.reducer
