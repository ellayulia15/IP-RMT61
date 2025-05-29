import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tutors from './pages/Tutors';
import StudentBookings from './pages/StudentBookings';
import TutorBookings from './pages/TutorBookings';
import Schedule from './pages/Schedule';
import DashboardTutor from './pages/DashboardTutor';
import Detail from './pages/Detail';
import CreateBooking from './pages/CreateBooking';
import CreateProfile from './pages/CreateProfile';
import EditProfile from './pages/EditProfile';
import AddSchedule from './pages/AddSchedule';
import UpdateSchedule from './pages/UpdateSchedule';

function PublicLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <div className="container pb-3">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProtectedLayout() {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <div className="container pb-3">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutors/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          {/* Student Routes */}
          <Route path="/student/bookings" element={<StudentBookings />} />
          <Route path="/bookings/create/:id" element={<CreateBooking />} />

          {/* Tutor Routes */}
          <Route path="/tutor/dashboard" element={<DashboardTutor />} />
          <Route path="/tutor/create-profile" element={<CreateProfile />} />
          <Route path="/tutor/edit-profile" element={<EditProfile />} />
          <Route path="/tutor/bookings" element={<TutorBookings />} />
          <Route path="/tutor/schedules" element={<Schedule />} />
          <Route path="/tutor/schedules/add" element={<AddSchedule />} />
          <Route path="/tutor/schedules/edit/:id" element={<UpdateSchedule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
