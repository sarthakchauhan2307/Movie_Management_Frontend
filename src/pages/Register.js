import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { Mail, Lock, Film, Loader, ArrowRight, User, Phone } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        phoneNumber: ''
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

        // Validation
        if (!formData.userName || !formData.email || !formData.password || !formData.phoneNumber) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Phone validation (basic)
        if (formData.phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            setLoading(false);
            return;
        }

        try {
            const result = await register(formData);

            if (result.success) {
                // Registration successful, redirect to login
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please login with your credentials.'
                    }
                });
            } else {
                setError(result.error || 'Registration failed. Please try again.');
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
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '48px'
                    }}>
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
                            Join the Ultimate Movie Experience
                        </p>
                    </div>

                    {/* Register Card */}
                    <div style={{
                        background: 'rgba(20, 20, 30, 0.85)',
                        backdropFilter: 'blur(30px)',
                        borderRadius: '20px',
                        padding: '48px 40px',
                        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '32px',
                            textAlign: 'center'
                        }}>
                            Create Your Account
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* User Name Field */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.3px'
                                }}>
                                    Full Name
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <User
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
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        disabled={loading}
                                        autoComplete="name"
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

                            {/* Phone Number Field */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.3px'
                                }}>
                                    Phone Number
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <Phone
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
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="1234567890"
                                        disabled={loading}
                                        autoComplete="tel"
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
                                        autoComplete="new-password"
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '28px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.9rem',
                                margin: 0,
                                fontWeight: '500'
                            }}>
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    style={{
                                        color: '#e50914',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#ff3333'}
                                    onMouseLeave={(e) => e.target.style.color = '#e50914'}
                                >
                                    Sign In
                                </a>
                            </p>
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

export default Register;
