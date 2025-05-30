import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchTutorBookings, updateBookingStatus } from '../stores/bookings/bookingsSlice';

export default function TutorBookings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: bookings, loading } = useSelector(state => state.bookings);

    useEffect(() => {
        dispatch(fetchTutorBookings()).unwrap()
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load bookings. Please try again later.',
                    confirmButtonColor: '#4A90E2'
                });
            });
    }, [dispatch]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await dispatch(updateBookingStatus({ id, status })).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Booking status updated successfully',
                confirmButtonColor: '#4A90E2'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update booking status',
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
                                        </div>                                        <h5 className="card-title mb-2">
                                            {booking.Student?.fullName}
                                        </h5>

                                        <p className="text-muted small mb-3">
                                            <i className="bi bi-envelope me-2"></i>
                                            {booking.Student?.email}
                                        </p>

                                        <div className="card bg-light mb-3">
                                            <div className="card-body py-2">
                                                <h6 className="card-subtitle mb-2">Schedule Details</h6>
                                                <p className="card-text mb-1">
                                                    <i className="bi bi-calendar me-2"></i>
                                                    {booking.Schedule?.date && new Date(booking.Schedule.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <i className="bi bi-clock me-2"></i>
                                                    {booking.Schedule?.time}
                                                </p>
                                            </div>
                                        </div>

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
