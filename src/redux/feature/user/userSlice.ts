import { createSlice } from '@reduxjs/toolkit'

interface User {
    id: string
    name: string
    email: string
    image_url: string
}

const initialState: User = {
    id: '',
    name: '',
    email: '',
    image_url: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.image_url = action.payload.image_url
        },

        clearUser: (state) => {
            state.id = ''
            state.name = ''
            state.email = ''
            state.image_url = ''
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer