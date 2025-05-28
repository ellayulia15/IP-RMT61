import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardTutor from "./pages/DashboardTutor";
import CreateProfile from "./pages/CreateProfile";
import EditProfile from "./pages/EditProfile";
import Schedule from "./pages/Schedule";
import AddSchedule from "./pages/AddSchedule";
import UpdateSchedule from "./pages/UpdateSchedule";
import Detail from "./pages/Detail";

// Auth protection component
function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Role protection component
function RequireTutor({ children }) {
  const role = localStorage.getItem('user_role');
  if (role !== 'Tutor') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Tutor Routes */}
        <Route path="/tutor">
          <Route path="dashboard" element={
            <RequireAuth>
              <RequireTutor>
                <DashboardTutor />
              </RequireTutor>
            </RequireAuth>
          } />
          <Route path="create-profile" element={
            <RequireAuth>
              <RequireTutor>
                <CreateProfile />
              </RequireTutor>
            </RequireAuth>
          } />
          <Route path="edit-profile" element={
            <RequireAuth>
              <RequireTutor>
                <EditProfile />
              </RequireTutor>
            </RequireAuth>
          } />
          <Route path="schedules" element={
            <RequireAuth>
              <RequireTutor>
                <Schedule />
              </RequireTutor>
            </RequireAuth>
          } />
          <Route path="schedules/add" element={
            <RequireAuth>
              <RequireTutor>
                <AddSchedule />
              </RequireTutor>
            </RequireAuth>
          } />
          <Route path="schedules/edit/:id" element={
            <RequireAuth>
              <RequireTutor>
                <UpdateSchedule />
              </RequireTutor>
            </RequireAuth>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
