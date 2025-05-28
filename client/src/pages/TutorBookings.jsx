import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function TutorBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await http.get('/bookings', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setBookings(data.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load bookings',
                confirmButtonColor: '#4A90E2'
            });
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await Swal.fire({
                title: `Are you sure you want to ${status.toLowerCase()} this booking?`,
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: status === 'Approved' ? '#28a745' : '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: status === 'Approved' ? 'Yes, approve it!' : 'Yes, reject it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await http.patch(`/bookings/${id}/status`, {
                        status
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                    Swal.fire(
                        `${status}!`,
                        `Booking has been ${status.toLowerCase()}.`,
                        'success'
                    );
                    fetchBookings();
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to update booking status',
                confirmButtonColor: '#4A90E2'
            });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link to="/tutor/dashboard" className="navbar-brand d-flex align-items-center">
                        <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                        <span className="h4 mb-0 text-primary">TutorHub</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/tutor/schedules" className="nav-link">Schedules</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/tutor/bookings" className="nav-link active">Bookings</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-outline-primary">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Booking Requests</h1>
                </div>

                {bookings.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="display-1 text-muted mb-4">
                                <i className="bi bi-calendar"></i>
                            </div>
                            <h2 className="h4 text-muted mb-4">No Booking Requests Yet</h2>
                            <p className="text-muted">Student booking requests will appear here</p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className={`badge ${booking.bookingStatus === 'Pending' ? 'bg-warning' :
                                                booking.bookingStatus === 'Approved' ? 'bg-success' :
                                                    'bg-danger'
                                                }`}>
                                                {booking.bookingStatus}
                                            </span>
                                            <span className={`badge ${booking.paymentStatus === 'Pending' ? 'bg-warning' :
                                                booking.paymentStatus === 'Paid' ? 'bg-success' :
                                                    'bg-danger'
                                                }`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </div>

                                        <h5 className="card-title mb-3">
                                            {booking.Schedule?.date && new Date(booking.Schedule.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h5>

                                        <p className="card-text mb-2">
                                            <i className="bi bi-clock me-2"></i>
                                            {booking.Schedule?.time}
                                        </p>
                                        <p className="card-text mb-2">
                                            <i className="bi bi-person me-2"></i>
                                            Student: {booking.Student?.fullName}
                                        </p>
                                        <p className="card-text mb-4">
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {Number(booking.Schedule?.fee).toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR'
                                            })}
                                        </p>

                                        {booking.bookingStatus === 'Pending' && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'Approved')}
                                                    className="btn btn-success flex-grow-1"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'Rejected')}
                                                    className="btn btn-danger flex-grow-1"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
