import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchMyBookings = createAsyncThunk(
    'bookings/fetchMyBookings',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/bookings');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const fetchTutorBookings = createAsyncThunk(
    'bookings/fetchTutorBookings',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await http.get('/bookings');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const { data } = await http.post('/bookings', bookingData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await http.patch(`/bookings/${id}/status`, { status });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
        }
    }
);

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTutorBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutorBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTutorBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export default bookingsSlice.reducer;
