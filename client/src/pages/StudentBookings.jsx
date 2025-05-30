import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchMyBookings, deleteBooking, updatePaymentStatus } from '../stores/bookings/bookingsSlice';
import http from '../lib/http';

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
    }, [dispatch]); const handleCancelBooking = async (id) => {
        try {
            await dispatch(deleteBooking(id)).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Booking cancelled successfully',
                confirmButtonColor: '#4A90E2'
            });
        } catch (error) {
            console.log(error, '<<< error cancel booking');

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message || 'Failed to cancel booking',
                confirmButtonColor: '#4A90E2'
            });
        }
    }; const handlePayment = async (id) => {
        try {
            console.log('Initiating payment for booking:', id);
            const { data } = await http.post(`/payments/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }); console.log('Payment token received:', data);            window.snap.pay(data.paymentToken, {
                onSuccess: function (result) {
                    console.log('Payment success:', result);
                    // Update payment status immediately
                    dispatch(updatePaymentStatus({ bookingId: id, status: 'Paid' }));
                    Swal.fire({
                        icon: 'success',
                        title: 'Pembayaran Berhasil!',
                        text: 'Terima kasih atas pembayaran Anda',
                        confirmButtonColor: '#4A90E2'
                    });
                },
                onPending: function (result) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Pembayaran Pending',
                        text: 'Silakan selesaikan pembayaran Anda',
                        confirmButtonColor: '#4A90E2'
                    });
                    dispatch(fetchMyBookings());
                },
                onError: function (result) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pembayaran Gagal',
                        text: 'Mohon coba lagi atau pilih metode pembayaran lain',
                        confirmButtonColor: '#4A90E2'
                    });
                },
                onClose: function () {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Pembayaran Dibatalkan',
                        text: 'Anda dapat mencoba pembayaran lagi nanti',
                        confirmButtonColor: '#4A90E2'
                    });
                }
            });
        } catch (err) {
            console.error('Payment error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to initialize payment',
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
                                            </span>                                            <span className={`badge ${
                                                booking.paymentStatus === 'Pending' ? 'bg-warning' :
                                                booking.paymentStatus === 'Paid' ? 'bg-success' :
                                                booking.paymentStatus === 'Failed' ? 'bg-danger' :
                                                'bg-secondary'
                                            }`}>
                                                {booking.paymentStatus || 'Pending'}
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
                                        </p>                                        {booking.bookingStatus === 'Pending' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="btn btn-outline-danger w-100"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}                                        {booking.bookingStatus === 'Approved' && 
                                        (booking.paymentStatus === 'Pending' || !booking.paymentStatus) && (
                                            <button
                                                onClick={() => handlePayment(booking.id)}
                                                className="btn btn-primary w-100 mt-3"
                                            >
                                                Pay Now
                                            </button>
                                        )}{booking.bookingStatus === 'Rejected' && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                Booking rejected by tutor. Please check other available schedules.
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
