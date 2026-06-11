import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        userName: null
    },
    reducers: {
        SetUser(state, action) {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
        },
        clearUser: (state) => {
            state.userId = null;
            state.userName = null;
        }
    }
});

export const { SetUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
