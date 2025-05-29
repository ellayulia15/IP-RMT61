import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchTutorSchedules = createAsyncThunk(
    'schedules/fetchTutorSchedules',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/schedules');
            return Array.isArray(data.data) ? data.data : [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutor schedules');
        }
    }
);

export const fetchMySchedules = createAsyncThunk(
    'schedules/fetchMySchedules',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/schedules');
            return Array.isArray(data.data) ? data.data : [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
        }
    }
);

export const createSchedule = createAsyncThunk(
    'schedules/createSchedule',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const { data } = await http.post('/schedules', scheduleData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
        }
    }
);

export const updateSchedule = createAsyncThunk(
    'schedules/updateSchedule',
    async ({ id, scheduleData }, { rejectWithValue }) => {
        try {
            const { data } = await http.put(`/schedules/${id}`, scheduleData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
        }
    }
);

export const deleteSchedule = createAsyncThunk(
    'schedules/deleteSchedule',
    async (id, { rejectWithValue }) => {
        try {
            await http.delete(`/schedules/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete schedule');
        }
    }
);

const schedulesSlice = createSlice({
    name: 'schedules',
    initialState: {
        items: [],
        loading: false,
        error: null,
        createLoading: false,
        createError: null,
        updateLoading: false,
        updateError: null,
        deleteLoading: false,
        deleteError: null
    },
    reducers: {
        clearSchedules: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.createLoading = false;
            state.createError = null;
            state.updateLoading = false;
            state.updateError = null;
            state.deleteLoading = false;
            state.deleteError = null;
        },
        setSchedules: (state, action) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch schedules cases
            .addCase(fetchTutorSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutorSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTutorSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMySchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMySchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMySchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create schedule cases
            .addCase(createSchedule.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.createLoading = false;
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })
            // Update schedule cases
            .addCase(updateSchedule.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateSchedule.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.updateLoading = false;
            })
            .addCase(updateSchedule.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })
            // Delete schedule cases
            .addCase(deleteSchedule.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.deleteLoading = false;
            })
            .addCase(deleteSchedule.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            });
    }
});

export const { clearSchedules, setSchedules } = schedulesSlice.actions;
export default schedulesSlice.reducer;
