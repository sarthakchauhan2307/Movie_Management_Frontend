import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { Mail, Lock, Shield, Loader } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Check if user is admin
                if (result.user.role === 'Admin') {
                    window.location.href = '/admin';
                } else {
                    setError('Access denied. Admin credentials required.');
                    setLoading(false);
                }
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
                setLoading(false);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px'
            }}>
                {/* Logo/Brand */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <Shield size={40} color="#f59e0b" />
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px'
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '1rem'
                    }}>
                        Sign in with admin credentials
                    </p>
                </div>

                {/* Login Card */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem'
                            }}>
                                Admin Email
                            </label>
                            <div style={{
                                position: 'relative'
                            }}>
                                <Mail
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8'
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter admin email"
                                    disabled={loading}
                                    autoComplete="email"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s',
                                        outline: 'none',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        color: 'white'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem'
                            }}>
                                Password
                            </label>
                            <div style={{
                                position: 'relative'
                            }}>
                                <Lock
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8'
                                    }}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s',
                                        outline: 'none',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        color: 'white'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#fca5a5',
                                fontSize: '0.9rem',
                                marginBottom: '24px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: loading ? '#374151' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: loading ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="spinner" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In as Admin'
                            )}
                        </button>
                    </form>

                    {/* Back to User Login */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '24px'
                    }}>
                        <a
                            href="/login"
                            style={{
                                color: '#94a3b8',
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#f59e0b'}
                            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                        >
                            ← Back to User Login
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.9rem'
                }}>
                    © 2026 MovieBooking Admin Portal
                </div>
            </div>

            {/* CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
