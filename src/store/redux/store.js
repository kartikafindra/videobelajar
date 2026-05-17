import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import coursesReducer from './slices/coursesSlice'
import notesReducer from './slices/notesSlice'
import usersReducer from './slices/usersSlice'
import apiReducer from './reducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    users: usersReducer,
    notes: notesReducer,
    api: apiReducer,
  },
})

export default store
