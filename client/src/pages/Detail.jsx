import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function Detail() {
    const { id } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutor();
    }, [id]);

    const fetchTutor = async () => {
        try {
            const { data } = await http.get(`/pub/tutors/${id}`);
            setTutor(data.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load tutor details. Please try again later.',
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

    if (!tutor) {
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
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <img src="/logo.png" alt="TutorHub" height="32" className="me-2" />
                        <span className="h4 mb-0 text-primary">TutorHub</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/tutors" className="nav-link active">Tutors</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

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
                                    <Link to="/login" className="btn btn-primary w-100">
                                        Book a Session
                                    </Link>
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

                                {tutor.Schedules?.length === 0 ? (
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
                                                {tutor.Schedules?.map((schedule) => (
                                                    <tr key={schedule.id}>
                                                        <td>
                                                            {new Date(schedule.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
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
                                                            <Link
                                                                to="/login"
                                                                className="btn btn-sm btn-outline-primary"
                                                            >
                                                                Book Now
                                                            </Link>
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