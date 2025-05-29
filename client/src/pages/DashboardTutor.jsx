import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchTutorProfile } from '../stores/tutorProfile/tutorProfileSlice';
import { fetchTutorBookings } from '../stores/bookings/bookingsSlice';
import { fetchTutorSchedules } from '../stores/schedules/schedulesSlice';

export default function DashboardTutor() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile: tutorProfile, loading: profileLoading, error: profileError } = useSelector(state => state.tutorProfile);
    const { items: bookings, loading: bookingsLoading, error: bookingsError } = useSelector(state => state.bookings);
    const { items: schedules, loading: schedulesLoading, error: schedulesError } = useSelector(state => state.schedules);
    
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        Promise.all([
            dispatch(fetchTutorProfile()).unwrap(),
            dispatch(fetchTutorBookings()).unwrap(),
            dispatch(fetchTutorSchedules()).unwrap()
        ]).catch((error) => {
            if (error.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Session Expired',
                    text: 'Please log in again'
                });
                localStorage.clear();
                navigate('/login');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to load dashboard data'
                });
            }
        });
    }, [navigate, dispatch]);

    const handleCreateProfile = () => {
        navigate('/tutor/create-profile');
    };

    if (profileLoading || bookingsLoading || schedulesLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (profileError || bookingsError || schedulesError) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="text-danger mb-3">
                        <i className="bi bi-exclamation-triangle display-4"></i>
                    </div>
                    <h3>Error Loading Dashboard</h3>
                    <p className="text-muted">{profileError || bookingsError || schedulesError}</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-5">
                {!tutorProfile ? (
                    // No Profile View
                    <div className="row justify-content-center">
                        <div className="col-md-8 text-center">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-5">
                                    <div className="display-1 text-muted mb-4">
                                        <i className="bi bi-person-plus"></i>
                                    </div>
                                    <h2 className="h4 text-primary mb-4">Complete Your Tutor Profile</h2>
                                    <p className="text-muted mb-4">
                                        Welcome to TutorHub! To start accepting students and managing your schedule,
                                        please create your tutor profile first.
                                    </p>
                                    <button
                                        onClick={handleCreateProfile}
                                        className="btn btn-primary btn-lg"
                                    >
                                        Create Tutor Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Dashboard with Profile
                    <div className="row">
                        {/* Profile Summary Card */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="text-center mb-4">
                                        <img
                                            src={tutorProfile.photoUrl || 'https://via.placeholder.com/128'}
                                            alt="Profile"
                                            className="rounded-circle mb-3"
                                            style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                                        />
                                        <h3 className="h5 mb-1">{tutorProfile.User?.fullName}</h3>
                                        <p className="text-muted mb-3">{tutorProfile.subjects}</p>
                                        <div className="d-grid">
                                            <Link to="/tutor/edit-profile" className="btn btn-outline-primary">
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <h4 className="h6 mb-2">Teaching Style</h4>
                                        <p className="text-muted mb-0">{tutorProfile.style}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="col-md-8">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-primary bg-opacity-10 p-3 rounded">
                                                    <i className="bi bi-calendar-check text-primary h4 mb-0"></i>
                                                </div>
                                                <div className="ms-3">
                                                    <h3 className="h6 mb-1">Total Schedules</h3>
                                                    <h4 className="h3 mb-0">{schedules.length || 0}</h4>
                                                </div>
                                            </div>
                                            <Link to="/tutor/schedules" className="btn btn-light w-100">
                                                Manage Schedule
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-info bg-opacity-10 p-3 rounded">
                                                    <i className="bi bi-hourglass-split text-info h4 mb-0"></i>
                                                </div>
                                                <div className="ms-3">
                                                    <h3 className="h6 mb-1">Pending Bookings</h3>
                                                    <h4 className="h3 mb-0">{bookings.filter(b => b.bookingStatus === 'Pending').length}</h4>
                                                </div>
                                            </div>
                                            <Link to="/tutor/bookings" className="btn btn-light w-100">
                                                View Bookings
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}