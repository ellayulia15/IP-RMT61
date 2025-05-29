import { configureStore } from '@reduxjs/toolkit';
import tutorsReducer from './tutors/tutorsSlice';
import userReducer from './user/userSlice';
import schedulesReducer from './schedules/schedulesSlice';
import bookingsReducer from './bookings/bookingsSlice';
import tutorProfileReducer from './tutorProfile/tutorProfileSlice';

export const store = configureStore({  reducer: {
    tutors: tutorsReducer,
    user: userReducer,
    schedules: schedulesReducer,
    bookings: bookingsReducer,
    tutorProfile: tutorProfileReducer,
  },
});
