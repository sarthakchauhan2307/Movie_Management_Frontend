import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';
import { Mail, Lock, Film, Loader, ArrowRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message from location state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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
                if (result.user.role === 'Admin') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
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
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background with movie posters */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/uploaded_media_1770098166055.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.5) blur(0.5px)',
                transform: 'scale(1.1)'
            }} />

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,40,0.75) 100%)'
            }} />

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px'
                }}>
                    {/* Logo Section */}
                    <div className="auth-logo-section">
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <Film size={48} color="#e50914" strokeWidth={2.5} />
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: 'white',
                                margin: 0,
                                letterSpacing: '-0.5px'
                            }}>
                                CineBook
                            </h1>
                        </div>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '1.1rem',
                            fontWeight: '400',
                            margin: 0
                        }}>
                            Your Gateway to Unlimited Entertainment
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="auth-card">
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '32px',
                            textAlign: 'center'
                        }}>
                            Welcome Back
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.3px'
                                }}>
                                    Email Address
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <Mail
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '18px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#888',
                                            zIndex: 1
                                        }}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        disabled={loading}
                                        autoComplete="email"
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px 16px 52px',
                                            border: '2px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            outline: 'none',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: 'white',
                                            fontWeight: '500'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#e50914';
                                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.3px'
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
                                            left: '18px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#888',
                                            zIndex: 1
                                        }}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        autoComplete="current-password"
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px 16px 52px',
                                            border: '2px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            outline: 'none',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: 'white',
                                            fontWeight: '500'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#e50914';
                                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <div style={{
                                    padding: '14px 18px',
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    border: '1px solid rgba(34, 197, 94, 0.4)',
                                    borderRadius: '10px',
                                    color: '#4ade80',
                                    fontSize: '0.9rem',
                                    marginBottom: '24px',
                                    fontWeight: '500'
                                }}>
                                    {successMessage}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    padding: '14px 18px',
                                    background: 'rgba(229, 9, 20, 0.15)',
                                    border: '1px solid rgba(229, 9, 20, 0.4)',
                                    borderRadius: '10px',
                                    color: '#ff6b6b',
                                    fontSize: '0.9rem',
                                    marginBottom: '24px',
                                    fontWeight: '500'
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
                                    padding: '18px',
                                    background: loading ? '#555' : 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.05rem',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    boxShadow: loading ? 'none' : '0 8px 24px rgba(229, 9, 20, 0.4)',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 12px 32px rgba(229, 9, 20, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 24px rgba(229, 9, 20, 0.4)';
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={22} className="spinner" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '28px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.9rem',
                                margin: '0 0 16px 0',
                                fontWeight: '500'
                            }}>
                                Don't have an account?{' '}
                                <a
                                    href="/register"
                                    style={{
                                        color: '#e50914',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#ff3333'}
                                    onMouseLeave={(e) => e.target.style.color = '#e50914'}
                                >
                                    Create Account
                                </a>
                            </p>
                            <a
                                href="/admin/login"
                                style={{
                                    color: '#888',
                                    fontSize: '0.85rem',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s',
                                    fontWeight: '500'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#e50914'}
                                onMouseLeave={(e) => e.target.style.color = '#888'}
                            >
                                Admin? Sign in here →
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '32px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                    }}>
                        © 2026 CineBook. Stream Your Dreams.
                    </div>
                </div>
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                
                input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Login;
