import { Link, useNavigate } from "react-router";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                    <span className="h4 mb-0 text-primary">TutorHub</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/tutors" className="nav-link">Tutors</Link>
                        </li>
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="btn btn-primary">Login</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {role === 'Student' && (
                                    <li className="nav-item">
                                        <Link to="/student/bookings" className="nav-link">My Bookings</Link>
                                    </li>
                                )}
                                {role === 'Tutor' && (
                                    <>
                                        <li className="nav-item">
                                            <Link to="/tutor/dashboard" className="nav-link">Dashboard</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/tutor/bookings" className="nav-link">Bookings</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/tutor/schedules" className="nav-link">Schedules</Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}