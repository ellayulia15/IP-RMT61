import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const { data } = await http.post('/login', formData);
            localStorage.setItem('access_token', data.data.access_token);
            localStorage.setItem('user_role', data.data.role);

            Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                text: 'Login successful',
                confirmButtonColor: '#4A90E2',
                timer: 1500,
                showConfirmButton: false
            });

            // Redirect based on role
            if (data.data.role === 'Tutor') {
                navigate('/tutor/dashboard');
            } else {
                navigate('/student/bookings');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.message || 'Invalid email or password',
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
                                    <h1 className="h4 text-primary mb-2">Welcome Back</h1>
                                    <p className="text-muted">Log in to your TutorHub account</p>
                                </div>

                                <form onSubmit={handleSubmit}>
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
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        Login
                                    </button>

                                    <p className="text-center mb-0">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary">
                                            Register
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