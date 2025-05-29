import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchTutorProfile = createAsyncThunk(
    'tutorProfile/fetchTutorProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return rejectWithValue('No auth token found');
            }

            const { data } = await http.get('/tutors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data.data) {
                return rejectWithValue('Profile not found');
            }

            return data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                return rejectWithValue('Session expired');
            }
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
                state.error = action.payload;
                state.profile = null;
            });
    }
});

export const { clearProfile } = tutorProfileSlice.actions;
export default tutorProfileSlice.reducer;
