import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchTutors = createAsyncThunk(
    'tutors/fetchTutors',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/pub/tutors');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutors');
        }
    }
);

export const fetchTutorDetail = createAsyncThunk(
    'tutors/fetchTutorDetail',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await http.get(`/pub/tutors/${id}`);
            if (!data.data) {
                return rejectWithValue('Tutor not found');
            }
            const { Schedules, ...tutorData } = data.data;
            
            // Sort schedules by date
            const sortedSchedules = Schedules ? [...Schedules].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];

            // Update schedules in the schedules slice
            dispatch({
                type: 'schedules/setSchedules',
                payload: sortedSchedules
            });

            return tutorData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutor details');
        }
    }
);

const tutorsSlice = createSlice({
    name: 'tutors',
    initialState: {
        items: [],
        currentTutor: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTutors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutors.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTutors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTutorDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutorDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTutor = action.payload;
            })
            .addCase(fetchTutorDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default tutorsSlice.reducer;
