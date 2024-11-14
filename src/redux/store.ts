import { configureStore } from '@reduxjs/toolkit'
import userSlice from './feature/user/userSlice'
import updateComponentSlice from './feature/updateComponent/updateComponentSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    updateComponent: updateComponentSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch