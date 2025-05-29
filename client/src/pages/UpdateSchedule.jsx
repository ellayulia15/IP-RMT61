import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import http from '../lib/http';

export default function UpdateSchedule() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        fee: ''
    });

    useEffect(() => {
        fetchSchedule();
    }, [id]);

    const fetchSchedule = async () => {
        try {
            const { data } = await http.get(`/schedules/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }); if (data.data) {
                // Split "13.00 - 15.00" into start and end times
                const [startTime, endTime] = data.data.time.split(' - ').map(t => t.replace('.', ':'));
                setFormData({
                    date: new Date(data.data.date).toISOString().split('T')[0],
                    startTime,
                    endTime,
                    fee: data.data.fee
                });
            }
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load schedule data',
                    confirmButtonColor: '#4A90E2'
                });
                navigate('/tutor/schedules');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Format time to "HH.mm - HH.mm"
            const startTimeFormatted = formData.startTime.replace(':', '.');
            const endTimeFormatted = formData.endTime.replace(':', '.');
            const timeRange = `${startTimeFormatted} - ${endTimeFormatted}`;

            await http.put(`/schedules/${id}`, {
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
                title: 'Schedule Updated!',
                text: 'Your teaching schedule has been updated',
                confirmButtonColor: '#4A90E2'
            });

            navigate('/tutor/schedules');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to update schedule',
                confirmButtonColor: '#4A90E2'
            });
        } finally {
            setSaving(false);
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
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="text-center text-primary mb-4">Update Schedule</h2>

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
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Fee</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-currency-exchange"></i></span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="fee"
                                                value={formData.fee}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-grow-1"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving Changes...
                                                </>
                                            ) : 'Save Changes'}
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