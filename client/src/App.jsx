import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardTutor from "./pages/DashboardTutor";
import CreateProfile from "./pages/CreateProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutor/dashboard" element={<DashboardTutor />} />
        <Route path="/tutor/create-profile" element={<CreateProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
