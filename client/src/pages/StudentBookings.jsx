import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchMyBookings } from '../stores/bookings/bookingsSlice';

export default function StudentBookings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: bookings, loading } = useSelector(state => state.bookings);

    useEffect(() => {
        dispatch(fetchMyBookings()).unwrap()
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load bookings. Please try again later.',
                    confirmButtonColor: '#4A90E2'
                });
            });
    }, [dispatch]);

    const handleCancelBooking = async (id) => {
        try {
            await dispatch(updateBookingStatus({ id, status: 'cancelled' })).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Booking cancelled successfully',
                confirmButtonColor: '#4A90E2'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to cancel booking',
                confirmButtonColor: '#4A90E2'
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
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
                    <h1 className="h3 mb-0">My Bookings</h1>
                    <Link to="/tutors" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>Book New Session
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="display-1 text-muted mb-4">
                                <i className="bi bi-calendar"></i>
                            </div>
                            <h2 className="h4 text-muted mb-4">No Bookings Yet</h2>
                            <Link to="/tutors" className="btn btn-primary">
                                Find a Tutor
                            </Link>
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
                                                booking.paymentStatus === 'paid' ? 'bg-success' :
                                                    'bg-danger'
                                                }`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </div>

                                        <h5 className="card-title mb-3">
                                            {booking.Schedule?.Tutor?.User?.fullName}
                                        </h5>

                                        <p className="card-text mb-2">
                                            <i className="bi bi-calendar me-2"></i>
                                            {new Date(booking.Schedule?.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="card-text mb-2">
                                            <i className="bi bi-clock me-2"></i>
                                            {booking.Schedule?.time}
                                        </p>
                                        <p className="card-text mb-4">
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {Number(booking.Schedule?.fee).toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR'
                                            })}
                                        </p>

                                        {booking.bookingStatus === 'Pending' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="btn btn-outline-danger w-100"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}

                                        {booking.paymentStatus === 'Pending' && (
                                            <button
                                                onClick={() => handlePayment(booking.id)}
                                                className="btn btn-primary w-100 mt-3"
                                            >
                                                Pay Now
                                            </button>
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
