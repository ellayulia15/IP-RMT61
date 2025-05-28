import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutors" element={<Tutors />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
