import { useState } from 'react';
import http from '../lib/http';

export default function Home() {
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: "Hi! I'm your AI learning assistant. What subjects are you interested in studying?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => setUserInput(e.target.value);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        const newMessages = [...chatMessages, { sender: 'user', text: userInput }];
        setChatMessages(newMessages);
        setUserInput('');
        setLoading(true);

        try {
            // Format pesan untuk OpenAI
            const messagesForAI = newMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
            const { data } = await http.post('/ai/chat', { messages: messagesForAI });
            setChatMessages(msgs => [...msgs, { sender: 'ai', text: data.reply }]);
        } catch (err) {
            console.log(err, '<<<error ai');

            setChatMessages(msgs => [...msgs, { sender: 'ai', text: "Sorry, AI is unavailable." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Hero Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">
                        Find Your Perfect Tutor in TutorHub
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

                {/* AI Chat Recommendation Section */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 overflow-hidden">
                            <div className="card-header bg-primary bg-opacity-10 border-0">
                                <h2 className="h5 mb-0 text-primary"><i className="bi bi-robot me-2"></i>AI Tutor Recommendation Chat</h2>
                            </div>
                            <div className="card-body p-0">
                                <div style={{ maxHeight: 350, overflowY: 'auto', background: '#f8f9fa' }} className="p-4 chat-ai-area">
                                    {chatMessages.map((msg, idx) => (
                                        <div key={idx} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : ''}`}>
                                            {msg.sender === 'ai' && (
                                                <div className="rounded-circle bg-primary p-2 d-flex align-items-center justify-content-center me-2" style={{ width: 40, height: 40 }}>
                                                    <i className="bi bi-robot text-white"></i>
                                                </div>
                                            )}
                                            <div className={`chat-bubble ${msg.sender === 'ai' ? 'bg-white text-dark' : 'bg-primary text-white'} p-3 rounded-3`} style={{ maxWidth: '70%' }}>
                                                {msg.text}
                                            </div>
                                            {msg.sender === 'user' && (
                                                <div className="rounded-circle bg-secondary p-2 d-flex align-items-center justify-content-center ms-2" style={{ width: 40, height: 40 }}>
                                                    <i className="bi bi-person text-white"></i>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="d-flex mb-3">
                                            <div className="rounded-circle bg-primary p-2 d-flex align-items-center justify-content-center me-2" style={{ width: 40, height: 40 }}>
                                                <i className="bi bi-robot text-white"></i>
                                            </div>
                                            <div className="chat-bubble bg-white text-dark p-3 rounded-3" style={{ maxWidth: '70%' }}>
                                                <span className="text-muted">AI is typing...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <form className="border-top d-flex p-3 bg-white" onSubmit={handleSend}>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light me-2"
                                        placeholder="Type your message..."
                                        value={userInput}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        style={{ minHeight: 44 }}
                                    />
                                    <button className="btn btn-primary" type="submit" disabled={loading || !userInput.trim()}>
                                        <i className="bi bi-send"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}