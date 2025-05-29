import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function CreateBooking() {    const { id } = useParams(); // Changed from scheduleId to match route parameter
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSchedule();    }, [id]);

    const fetchSchedule = async () => {
        try {
            const { data } = await http.get(`/schedules/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setSchedule(data.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');            } else {
                const errorMessage = err.response?.data?.message || 'Failed to load schedule details';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: '#4A90E2'
                });
                navigate('/tutors');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await http.post('/bookings', {
                ScheduleId: schedule.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Booking Created!',
                text: 'Your session has been booked successfully',
                confirmButtonColor: '#4A90E2'
            });

            navigate('/student/bookings');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to create booking',
                confirmButtonColor: '#4A90E2'
            });
        } finally {
            setSubmitting(false);
        }
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

    if (!schedule) {
        return (
            <div className="min-vh-100 bg-light">
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                    <div className="container">
                        <Link to="/" className="navbar-brand d-flex align-items-center">
                            <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                            <span className="h4 mb-0 text-primary">TutorHub</span>
                        </Link>
                    </div>
                </nav>
                <div className="container py-5 text-center">
                    <h2>Schedule Not Found</h2>
                    <Link to="/tutors" className="btn btn-primary mt-3">
                        Back to Tutors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                        <span className="h4 mb-0 text-primary">TutorHub</span>
                    </Link>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="text-center text-primary mb-4">Confirm Booking</h2>

                                <div className="mb-4">
                                    <h3 className="h5">Session Details</h3>
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <p className="mb-2">
                                                <strong>Date:</strong> {new Date(schedule.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Time:</strong> {schedule.time}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Fee:</strong> <i className="bi bi-currency-exchange me-1"></i>
                                                {Number(schedule.fee).toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Booking...
                                                </>
                                            ) : 'Confirm Booking'}
                                        </button>
                                        <Link to="/tutors" className="btn btn-light">
                                            Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
