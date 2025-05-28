import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function Schedule() {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const { data } = await http.get('/schedules', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setSchedules(data.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load schedules',
                confirmButtonColor: '#4A90E2'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await http.delete(`/schedules/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                    Swal.fire(
                        'Deleted!',
                        'Schedule has been deleted.',
                        'success'
                    );
                    fetchSchedules();
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to delete schedule',
                confirmButtonColor: '#4A90E2'
            });
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

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link to="/tutor/dashboard" className="navbar-brand d-flex align-items-center">
                        <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                        <span className="h4 mb-0 text-primary">TutorHub</span>
                    </Link>
                </div>
            </nav>

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
                                        </div>                                        <p className="card-text mb-3">
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