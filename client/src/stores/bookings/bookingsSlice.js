import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../lib/http';

export const fetchMyBookings = createAsyncThunk(
    'bookings/fetchMyBookings',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return rejectWithValue('No auth token found');
            }

            const { data } = await http.get('/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                return rejectWithValue('Session expired');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const fetchTutorBookings = createAsyncThunk(
    'bookings/fetchTutorBookings',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return rejectWithValue('No auth token found');
            }

            const { data } = await http.get('/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.data;
        } catch (error) {
            console.log(error, '<<< err di booking');
            if (error.response?.status === 401) {
                localStorage.clear();
                return rejectWithValue('Session expired');
            }
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
            const token = localStorage.getItem('access_token');
            if (!token) {
                return rejectWithValue('No auth token found');
            }

            const { data } = await http.patch(`/bookings/${id}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                return rejectWithValue('Session expired');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
        }
    }
);

export const deleteBooking = createAsyncThunk(
    'bookings/deleteBooking',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return rejectWithValue('No auth token found');
            }

            const { data } = await http.delete(`/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return id; // Return the id to remove it from state
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                return rejectWithValue('Session expired');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
        }
    }
);

export const updatePaymentStatus = createAsyncThunk(
    'bookings/updatePaymentStatus',
    async ({ bookingId, status }, { getState }) => {
        const state = getState();
        const booking = state.bookings.items.find(b => b.id === bookingId);
        return { ...booking, paymentStatus: status };
    }
);

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearBookings: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    },
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
                state.error = action.payload;
                state.items = [];
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
                state.error = action.payload;
                state.items = [];
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                // Remove the deleted booking from state
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const { clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
