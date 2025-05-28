import { Link } from 'react-router';
import '../styles/home.css';

export default function Home() {

    return (
        <div className="min-vh-100 bg-light">
            {/* Header */}
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
                                <Link to="/tutors" className="nav-link">Tutors</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">
                        Find Your Perfect Tutor and AI-Powered Tutoring Matches
                    </h1>
                    <p className="lead text-muted mb-4">
                        Connect with expert tutors who can help you achieve your learning goals. Our advanced AI system analyzes your learning style and goals to find the perfect tutor match for you.
                    </p>
                </div>

                {/* AI Features Section */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-primary bg-opacity-10">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="bi bi-brain display-4 text-primary"></i>
                                </div>
                                <h3 className="h4 mb-3">Natural Language Understanding</h3>
                                <p className="text-muted">Our AI understands your learning preferences through natural conversation</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-info bg-opacity-10">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="bi bi-graph-up display-4 text-info"></i>
                                </div>
                                <h3 className="h4 mb-3">Smart Matching</h3>
                                <p className="text-muted">Get paired with tutors who match your learning style and pace</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-success bg-opacity-10">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="bi bi-lightning display-4 text-success"></i>
                                </div>
                                <h3 className="h4 mb-3">Adaptive Learning</h3>
                                <p className="text-muted">AI continuously improves recommendations based on your progress</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Chat Demo Section */}
                <div className="card shadow-sm border-0 overflow-hidden">
                    <div className="card-body p-4">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <h2 className="h3 mb-3">Experience Smart Learning</h2>
                                <p className="mb-4">Try our AI chat to get personalized tutor recommendations based on your:</p>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Learning Goals</li>
                                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Subject Preferences</li>
                                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Study Schedule</li>
                                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Teaching Style Preference</li>
                                </ul>
                                <Link to="/login" className="btn btn-primary">
                                    Get Started with AI Matching
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <div className="p-3 bg-light rounded-3 mt-4 mt-lg-0">
                                    <div className="chat-demo border rounded-3 p-3 bg-white">
                                        <div className="d-flex mb-3">
                                            <div className="rounded-circle bg-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-robot text-white"></i>
                                            </div>
                                            <div className="ms-3">
                                                <p className="mb-0">Hi! I'm your AI learning assistant. What subjects are you interested in studying?</p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <div className="rounded-circle bg-secondary p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-person text-white"></i>
                                            </div>
                                            <div className="ms-3">
                                                <p className="mb-0">I need help with Advanced Mathematics and Physics</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="rounded-circle bg-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-robot text-white"></i>
                                            </div>
                                            <div className="ms-3">
                                                <p className="mb-0">Great! What's your preferred learning style? Do you like visual explanations or prefer theoretical approaches?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}