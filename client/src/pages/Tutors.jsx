import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { fetchTutors } from '../stores/tutors/tutorsSlice';
import Swal from 'sweetalert2';

export default function Tutors() {
    const dispatch = useDispatch();
    const { items: tutors, loading, error } = useSelector((state) => state.tutors);

    useEffect(() => {
        dispatch(fetchTutors()).unwrap()
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load tutors. Please try again later.',
                    confirmButtonColor: '#4A90E2'
                });
            });
    }, [dispatch]);

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
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={tutor.photoUrl || 'https://via.placeholder.com/64'}
                                            alt={tutor.User?.fullName}
                                            className="rounded-circle me-3"
                                            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h3 className="h5 mb-1">{tutor.User?.fullName}</h3>
                                            <p className="text-muted mb-0">{tutor.subjects}</p>
                                        </div>
                                    </div>
                                    <p className="mb-3">
                                        <span className="text-muted">
                                            <i className="bi bi-mortarboard me-2"></i>{tutor.style}
                                        </span>
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