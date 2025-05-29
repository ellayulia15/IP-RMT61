import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchTutorProfile = createAsyncThunk(
    'tutorProfile/fetchTutorProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/tutors');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutor profile');
        }
    }
);

const tutorProfileSlice = createSlice({
    name: 'tutorProfile',
    initialState: {
        profile: null,
        loading: false,
        error: null
    },
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTutorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchTutorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearProfile } = tutorProfileSlice.actions;
export default tutorProfileSlice.reducer;
