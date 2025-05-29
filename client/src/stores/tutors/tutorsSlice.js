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
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await http.get(`/pub/tutors/${id}`);
            if (!data.data) {
                return rejectWithValue('Tutor not found');
            }

            // Sort schedules by date if they exist
            if (data.data.Schedules) {
                data.data.Schedules = data.data.Schedules
                    .filter(schedule => new Date(schedule.date) >= new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(schedule => ({
                        ...schedule,
                        date: new Date(schedule.date).toISOString().split('T')[0],
                        startTime: schedule.startTime?.includes('T') ? schedule.startTime.split('T')[1] : schedule.startTime,
                        endTime: schedule.endTime?.includes('T') ? schedule.endTime.split('T')[1] : schedule.endTime
                    }));
            }

            return data.data;
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
