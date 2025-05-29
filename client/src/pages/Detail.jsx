import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorDetail } from '../stores/tutors/tutorsSlice';
import Swal from 'sweetalert2';

export default function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentTutor: tutor, loading: tutorLoading, error: tutorError } = useSelector(state => state.tutors);
    const { role } = useSelector(state => state.user) || {};

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
    }, [dispatch, id]);

    const handleBookClick = (scheduleId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login or register first to book a tutor',
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

        if (role && role !== 'Student') {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only students can book tutoring sessions',
                confirmButtonColor: '#4A90E2'
            });
            return;
        }

        navigate(`/bookings/create/${scheduleId}`);
    };

    if (tutorLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
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

                    {/* Available Schedules */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h3 className="h5 mb-4">Available Teaching Schedules</h3>

                                {!tutor.Schedules?.length ? (
                                    <p className="text-muted">No available schedules at the moment.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Fee</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tutor.Schedules.map((schedule) => (
                                                    <tr key={schedule.id}>
                                                        <td>
                                                            {schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }) : 'Date not available'}
                                                        </td>
                                                        <td>{schedule.time}</td>
                                                        <td>
                                                            <i className="bi bi-currency-exchange me-1"></i>
                                                            {Number(schedule.fee).toLocaleString('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR'
                                                            })}
                                                        </td>
                                                        <td className="text-end">
                                                            <button
                                                                onClick={() => handleBookClick(schedule.id)}
                                                                className="btn btn-sm btn-outline-primary"
                                                                disabled={schedule.isBooked}
                                                            >
                                                                {schedule.isBooked ? 'Booked' : 'Book Now'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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