import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorDetail } from '../stores/tutors/tutorsSlice';
import { clearSchedules } from '../stores/schedules/schedulesSlice';
import Swal from 'sweetalert2';

export default function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentTutor: tutor, loading: tutorLoading, error: tutorError } = useSelector(state => state.tutors);
    const { items: schedules = [], loading: schedulesLoading } = useSelector(state => state.schedules);

    useEffect(() => {
        dispatch(fetchTutorDetail(id))
            .unwrap()
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error || 'Failed to load tutor details. Please try again later.',
                    confirmButtonColor: '#4A90E2'
                });
            });

        // Cleanup on unmount
        return () => {
            dispatch(clearSchedules());
        };
    }, [dispatch, id]);

    const handleBookClick = (scheduleId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login or register first as student to book a tutor',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Register',
                confirmButtonColor: '#4A90E2',
                cancelButtonColor: '#3EC59D'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate('/register');
                }
            });
            return;
        }
        navigate(`/bookings/create/${scheduleId}`);
    };

    if (tutorLoading || schedulesLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (tutorError) {
        return (
            <div className="min-vh-100 bg-light">
                <div className="container py-5 text-center">
                    <div className="text-danger mb-3">
                        <i className="bi bi-exclamation-triangle display-4"></i>
                    </div>
                    <h2>Error Loading Tutor</h2>
                    <p className="text-muted">{tutorError}</p>
                    <Link to="/tutors" className="btn btn-primary mt-3">
                        Back to Tutors
                    </Link>
                </div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="min-vh-100 bg-light">
                <div className="container py-5 text-center">
                    <h2>Tutor Not Found</h2>
                    <Link to="/tutors" className="btn btn-primary mt-3">
                        Back to Tutors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-5">
                <div className="row">
                    {/* Tutor Profile Card */}
                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <img
                                        src={tutor.photoUrl || 'https://via.placeholder.com/128'}
                                        alt={tutor.User?.fullName}
                                        className="rounded-circle mb-3"
                                        style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                                    />
                                    <h2 className="h4 mb-1">{tutor.User?.fullName}</h2>
                                    <p className="text-muted mb-3">{tutor.subjects}</p>
                                </div>
                                <hr />
                                <div className="mb-0">
                                    <h3 className="h6 mb-2">Teaching Style</h3>
                                    <p className="text-muted mb-0">{tutor.style}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedules */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h3 className="h5 mb-4">Available Schedules</h3>
                                {schedules.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="text-muted mb-3">
                                            <i className="bi bi-calendar-x display-4"></i>
                                        </div>
                                        <p className="mb-0">No schedules available at the moment.</p>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {schedules.map((schedule) => (
                                            <div key={schedule.id} className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <div>
                                                                <h4 className="h6 mb-1">
                                                                    {new Date(schedule.date).toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </h4>
                                                                <p className="text-muted small mb-0">
                                                                    {new Date(`2000-01-01T${schedule.startTime}`).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                    })} - {new Date(`2000-01-01T${schedule.endTime}`).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleBookClick(schedule.id)}
                                                                className="btn btn-outline-primary btn-sm"
                                                                disabled={schedule.isBooked}
                                                            >
                                                                {schedule.isBooked ? 'Booked' : 'Book Now'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}