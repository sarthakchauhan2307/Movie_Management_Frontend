import React from 'react';
import { X, CreditCard, Ticket, AlertCircle } from 'lucide-react';

const BookingConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    selectedSeats,
    totalAmount,
    seatPrice,
    convenienceFee,
    processing
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="booking-confirm-modal"
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(6px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={processing ? null : onClose}
            >
                {/* Modal */}
                <div
                    className="card"
                    style={{
                        position: 'relative',
                        maxWidth: '520px',
                        width: '100%',
                        padding: '0',
                        animation: 'slideUp 0.3s ease-out',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
                        overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient */}
                    <div className="booking-confirm-modal-header" style={{
                        background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                        padding: '28px 32px',
                        position: 'relative'
                    }}>
                        {/* Close Button */}
                        {!processing && (
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'var(--transition)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Ticket size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    margin: 0,
                                    color: 'white'
                                }}>
                                    Confirm Booking
                                </h2>
                                <p style={{
                                    margin: '4px 0 0 0',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.9rem'
                                }}>
                                    Review your booking details
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="booking-confirm-modal-body" style={{ padding: '28px 32px' }}>
                        {/* Selected Seats */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '12px'
                            }}>
                                Selected Seats
                            </div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}>
                                {selectedSeats.map(seat => (
                                    <span
                                        key={seat}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'var(--bg-tertiary)',
                                            border: '2px solid var(--primary)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'var(--primary)'
                                        }}
                                    >
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: 'var(--border)',
                            margin: '24px 0'
                        }} />

                        {/* Price Breakdown */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '16px'
                            }}>
                                Price Details
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <span>Tickets ({selectedSeats.length} × ₹{seatPrice})</span>
                                    <span style={{ fontWeight: '600' }}>₹{selectedSeats.length * seatPrice}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    <span>Convenience Fee</span>
                                    <span style={{ fontWeight: '600' }}>₹{convenienceFee}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '2px solid var(--border)',
                                fontSize: '1.4rem',
                                fontWeight: '700'
                            }}>
                                <span>Total Amount</span>
                                <span style={{
                                    color: 'var(--primary)',
                                    background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    ₹{totalAmount}
                                </span>
                            </div>
                        </div>

                        {/* Info Notice */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '14px',
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px'
                        }}>
                            <AlertCircle size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5
                            }}>
                                By proceeding, you agree to complete the payment. Cancellation charges may apply.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="booking-confirm-modal-actions" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px'
                        }}>
                            <button
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={processing}
                                style={{
                                    justifyContent: 'center',
                                    opacity: processing ? 0.5 : 1
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={onConfirm}
                                disabled={processing}
                                style={{
                                    justifyContent: 'center',
                                    gap: '8px',
                                    opacity: processing ? 0.8 : 1
                                }}
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        Proceed to Pay
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
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
                            transform: translateY(30px) scale(0.95);
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

export default BookingConfirmModal;
