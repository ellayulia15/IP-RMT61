import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import http from '../lib/http';
import Swal from 'sweetalert2';

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutors();
    }, []); const fetchTutors = async () => {
        try {
            const { data } = await http.get('/pub/tutors');
            setTutors(data.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load tutors. Please try again later.',
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
    } return (
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
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">Our Expert Tutors</h1>
                    <p className="lead text-muted mb-4">
                        Browse our diverse selection of professional tutors and find the perfect match for your learning needs
                    </p>
                </div>

                <div className="row g-4">
                    {tutors.map((tutor) => (
                        <div key={tutor.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">                                        <img
                                        src={tutor.photoUrl || 'https://via.placeholder.com/64'}
                                        alt={tutor.User?.fullName}
                                        className="rounded-circle me-3"
                                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                    />
                                        <div>                                            <h3 className="h5 mb-1">{tutor.User?.fullName}</h3>
                                            <p className="text-muted mb-0">{tutor.subjects}</p>
                                        </div>
                                    </div>                                    <p className="mb-3">
                                        <span className="text-muted"><i className="bi bi-mortarboard me-2"></i>{tutor.style}</span>
                                    </p>
                                    <div className="text-end">
                                        <Link to={`/tutors/${tutor.id}`} className="btn btn-outline-primary">
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}