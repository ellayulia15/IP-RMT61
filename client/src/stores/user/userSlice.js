import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async () => {
    const { data } = await http.get('/profile');
    return data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        loading: false,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.profile = action.payload;
        },
        clearUser: (state) => {
            state.profile = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;