import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySchedules, deleteSchedule } from '../stores/schedules/schedulesSlice';
import Swal from 'sweetalert2';

export default function Schedule() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: schedules = [], loading, error } = useSelector(state => state.schedules);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        dispatch(fetchMySchedules())
            .unwrap()
            .catch((error) => {
                if (error === 'Session expired') {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error || 'Failed to load schedules. Please try again later.',
                        confirmButtonColor: '#4A90E2'
                    });
                }
            });
    }, [dispatch, navigate]);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteSchedule(id)).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Schedule deleted successfully',
                confirmButtonColor: '#4A90E2'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete schedule',
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
                    <h1 className="h3 mb-0">My Teaching Schedule</h1>
                    <Link to="/tutor/schedules/add" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>Add New Schedule
                    </Link>
                </div>
                {schedules.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="display-1 text-muted mb-4">
                                <i className="bi bi-calendar"></i>
                            </div>
                            <h2 className="h4 text-muted mb-4">No Schedules Yet</h2>
                            <Link to="/tutor/schedules/add" className="btn btn-primary">
                                Create Your First Schedule
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title mb-0">
                                                {new Date(schedule.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </h5>
                                        </div>
                                        <p className="card-text mb-3">
                                            <i className="bi bi-clock me-2"></i>
                                            {schedule.time}
                                        </p>
                                        <p className="card-text mb-4">
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {Number(schedule.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                        </p>
                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/tutor/schedules/edit/${schedule.id}`}
                                                className="btn btn-outline-primary flex-grow-1"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(schedule.id)}
                                                className="btn btn-outline-danger"
                                            >
                                                <i className="bi bi-trash"></i>
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
    );
}