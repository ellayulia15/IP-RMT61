import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Student'
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
        try {
            await http.post('/register', formData);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Please login to continue',
                confirmButtonColor: '#4A90E2'
            });
            navigate('/login');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.message || 'Something went wrong',
                confirmButtonColor: '#4A90E2'
            });
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <Link to="/" className="d-inline-block mb-3">
                                        <img src="/logo.png" alt="TutorHub" height="40" />
                                    </Link>
                                    <h1 className="h4 text-primary mb-2">Create an Account</h1>
                                    <p className="text-muted">Join TutorHub and start learning today</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Tutor">Tutor</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Create a password"
                                            minLength={6}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        Register
                                    </button>

                                    <p className="text-center mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary">
                                            Login
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}