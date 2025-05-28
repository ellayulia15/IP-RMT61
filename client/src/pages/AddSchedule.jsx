import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function AddSchedule() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        fee: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Format time to "HH.mm - HH.mm"
            const startTimeFormatted = formData.startTime.replace(':', '.');
            const endTimeFormatted = formData.endTime.replace(':', '.');
            const timeRange = `${startTimeFormatted} - ${endTimeFormatted}`;

            await http.post('/schedules', {
                date: formData.date,
                time: timeRange,
                fee: formData.fee
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Schedule Created!',
                text: 'New teaching schedule has been added',
                confirmButtonColor: '#4A90E2'
            });

            navigate('/tutor/schedules');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to create schedule',
                confirmButtonColor: '#4A90E2'
            });
        } finally {
            setLoading(false);
        }
    };

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
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="text-center text-primary mb-4">Add New Schedule</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>                                    <div className="mb-3">
                                        <label className="form-label">Time Range</label>
                                        <div className="row g-2">
                                            <div className="col">
                                                <div className="input-group">
                                                    <span className="input-group-text">From</span>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        name="startTime"
                                                        value={formData.startTime}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="input-group">
                                                    <span className="input-group-text">To</span>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        name="endTime"
                                                        value={formData.endTime}
                                                        onChange={handleChange}
                                                        required
                                                        min={formData.startTime}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            Will be displayed as "13.00 - 15.00" format
                                        </small>
                                    </div>                                    <div className="mb-4">
                                        <label className="form-label">Fee</label>
                                        <div className="input-group">                                            <span className="input-group-text">
                                            <i className="bi bi-currency-exchange"></i>
                                        </span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="fee"
                                                value={formData.fee}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-grow-1"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Schedule...
                                                </>
                                            ) : 'Create Schedule'}
                                        </button>
                                        <Link
                                            to="/tutor/schedules"
                                            className="btn btn-light"
                                        >
                                            Cancel
                                        </Link>
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