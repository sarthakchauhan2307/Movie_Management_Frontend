import React from 'react';
import { X, CalendarX } from 'lucide-react';

const NoShowsModal = ({ isOpen, onClose, movieTitle }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="card"
                    style={{
                        position: 'relative',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '32px',
                        animation: 'slideUp 0.3s ease-out',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <CalendarX size={32} color="#ef4444" />
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: 'white'
                    }}>
                        No Shows Available
                    </h2>

                    {/* Message */}
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '24px',
                        fontSize: '1rem'
                    }}>
                        There are currently no shows available for{' '}
                        <strong style={{ color: 'white' }}>{movieTitle}</strong>{' '}
                        in the next 10 days. Please check back later for upcoming showtimes.
                    </p>

                    {/* Action Button */}
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                        style={{ width: '100%' }}
                    >
                        Got it
                    </button>
                </div>
            </div>

            {/* Animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default NoShowsModal;
