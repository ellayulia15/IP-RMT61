import { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function CreateProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        photoUrl: '',
        subjects: '',
        style: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await http.post('/tutors', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Profile Created!',
                text: 'Your tutor profile has been created successfully.',
                confirmButtonColor: '#4A90E2'
            });

            navigate('/tutor/dashboard');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to create profile',
                confirmButtonColor: '#4A90E2'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="text-center text-primary mb-4">Create Your Tutor Profile</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Profile Photo URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="photoUrl"
                                            value={formData.photoUrl}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter the URL of your profile photo"
                                        />
                                        <small className="text-muted">
                                            Please provide a URL to your professional photo
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Subjects</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="subjects"
                                            value={formData.subjects}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Mathematics, Physics, Chemistry"
                                        />
                                        <small className="text-muted">
                                            List the subjects you can teach, separated by commas
                                        </small>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Teaching Style</label>
                                        <textarea
                                            className="form-control"
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            placeholder="Describe your teaching approach and methodology"
                                        ></textarea>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Profile...
                                                </>
                                            ) : 'Create Profile'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            onClick={() => navigate('/tutor/dashboard')}
                                        >
                                            Cancel
                                        </button>
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
