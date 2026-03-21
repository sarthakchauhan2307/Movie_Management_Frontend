import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAPI, movieAPI, theatreAPI, screenAPI, bookingAPI } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import BookingConfirmModal from '../components/BookingConfirmModal';
import { Clock, MapPin, Calendar, ArrowLeft, CreditCard, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper function to format time from "HH:MM:SS" to "HH:MM AM/PM"
const formatShowTime = (timeString) => {
    if (typeof timeString === 'string' && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }
    return timeString;
};

const API_BASE_URL = 'http://movieservice.runasp.net';

const getPosterUrl = (posterUrl) => {
    if (!posterUrl) return 'https://via.placeholder.com/400x600?text=No+Poster';
    if (posterUrl.startsWith('http')) return posterUrl;
    return `${API_BASE_URL}${posterUrl}`;
};

const SelectSeats = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [show, setShow] = useState(null);
    const [movie, setMovie] = useState(null);
    const [screen, setScreen] = useState(null);
    const [theatre, setTheatre] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    const loadShowDetails = useCallback(async () => {
        try {
            setLoading(true);

            const showData = await showAPI.getShowById(showId);
            setShow(showData);

            // First get screen
            let screenData = null;
            try {
                screenData = await screenAPI.getScreenById(showData.screenId);
                setScreen(screenData);
            } catch (error) {
                console.error('Error fetching screen:', error);
            }

            // Load movie data (critical for page display)
            try {
                const movieData = await movieAPI.getMovieById(showData.movieId);
                setMovie(movieData);
            } catch (error) {
                console.error('Error fetching movie:', error);
            }

            // Load theatre data (non-critical, page can render without it)
            if (screenData) {
                try {
                    const theatreData = await theatreAPI.getTheatreById(screenData.theatreId);
                    setTheatre(theatreData);
                } catch (error) {
                    console.error('Error fetching theatre:', error);
                }
            }

            // Load available seats (non-critical, fallback to screen seat count)
            try {
                const seatsData = await showAPI.getAvailableSeats(showId);
                setAvailableSeats(seatsData || screenData?.seatCount || 100);
            } catch (error) {
                console.error('Error fetching available seats:', error);
                setAvailableSeats(screenData?.seatCount || 100);
            }

            // Load occupied seats for this show (non-critical, fallback to empty)
            try {
                const occupied = await bookingAPI.getOccupiedSeatsForShow(showId);
                setOccupiedSeats(occupied);
            } catch (error) {
                console.error('Error fetching occupied seats:', error);
                setOccupiedSeats([]);
            }

        } catch (error) {
            console.error('Error loading show details:', error);
        } finally {
            setLoading(false);
        }
    }, [showId]);

    useEffect(() => {
        loadShowDetails();
    }, [loadShowDetails]);



    const handleSeatClick = (seatId) => {
        // Prevent selection of occupied seats
        if (occupiedSeats.includes(seatId)) {
            return;
        }

        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) return;

        try {
            setProcessing(true);

            // Step 1: Create booking with seats in one call
            const bookingData = {
                showId: parseInt(showId),
                userId: user.userId,
                seatNos: selectedSeats
            };

            console.log('Creating booking with seats...', bookingData);
            const booking = await bookingAPI.createBookingWithSeats(bookingData);

            if (!booking || !booking.bookingId) {
                throw new Error('Failed to create booking');
            }

            console.log('Booking created successfully:', booking.bookingId);

            // Step 2: Close modal and navigate to confirmation page
            setShowConfirmModal(false);
            navigate(`/booking/confirmation/${booking.bookingId}`);

        } catch (error) {
            console.error('Booking failed:', error);

            // Show specific error message
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Unknown error';

            let displayMessage = 'Booking failed. Please try again.';

            if (errorMessage.includes('already booked') || errorMessage.includes('occupied')) {
                displayMessage = `Failed to book seats: One or more seats are already booked. Please select different seats.`;
            } else if (errorMessage) {
                displayMessage = `Booking failed: ${errorMessage}`;
            }

            setErrorModal({ show: true, message: displayMessage });
            setShowConfirmModal(false);
            setSelectedSeats([]);
            // Reload occupied seats to get latest state
            loadShowDetails();
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="loader">
            </div>
        );
    }

    if (!show) {
        return (
            <div className="loader">
                <h2 style={{ color: 'var(--error)' }}>Show not found</h2>
            </div>
        );
    }

    const seatPrice = show.price || 150; // Use show price from API
    const totalPrice = selectedSeats.length * seatPrice;
    const convenienceFee = selectedSeats.length * 20;
    const finalAmount = totalPrice + convenienceFee;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '20px 0'
            }}>
                <div className="container">
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            fontSize: '0.95rem'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Shows
                    </button>

                    <div className="seat-header-info">
                        {movie && (
                            <img
                                src={getPosterUrl(movie.posterUrl)}
                                alt={movie.title}
                                style={{
                                    width: '60px',
                                    height: '90px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                        )}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h2 style={{ margin: 0 }}>{movie?.title || 'Movie'}</h2>
                                {movie && new Date(movie.releaseDate) > new Date() && (
                                    <span style={{
                                        padding: '4px 12px',
                                        background: 'var(--warning)',
                                        color: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        Advance Booking
                                    </span>
                                )}
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={14} />
                                    {theatre?.theatreName || 'Theatre'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} />
                                    {new Date(show.showDate).toLocaleDateString('en-IN')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={14} />
                                    {formatShowTime(show.showTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seat Selection */}
            <div className="container" style={{ padding: '40px 20px' }}>
                <div className="seats-page-grid">
                    {/* Left: Seat Grid */}
                    <div className="card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>
                            Select Your Seats
                        </h3>
                        <SeatGrid
                            availableSeats={availableSeats}
                            occupiedSeats={occupiedSeats}
                            selectedSeats={selectedSeats}
                            onSeatClick={handleSeatClick}
                            totalSeats={screen?.seatCapacity || 100}
                        />
                    </div>

                    {/* Right: Booking Summary */}
                    <div>
                        <div className="card" style={{
                            padding: '24px',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <h3 style={{ marginBottom: '20px' }}>Booking Summary</h3>

                            {/* Selected Seats */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    marginBottom: '8px'
                                }}>
                                    Selected Seats ({selectedSeats.length})
                                </div>
                                <div style={{
                                    padding: '12px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    minHeight: '50px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {selectedSeats.length === 0 ? (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            No seats selected
                                        </span>
                                    ) : (
                                        selectedSeats.map(seat => (
                                            <span key={seat} className="badge badge-primary">
                                                {seat}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="divider" />

                            {/* Price Breakdown */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <span>Ticket Price ({selectedSeats.length} × ₹{seatPrice})</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    <span>Convenience Fee</span>
                                    <span>₹{convenienceFee}</span>
                                </div>
                            </div>

                            <div className="divider" />

                            {/* Total */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                                fontSize: '1.3rem',
                                fontWeight: '700'
                            }}>
                                <span>Total Amount</span>
                                <span style={{ color: 'var(--primary)' }}>₹{finalAmount}</span>
                            </div>

                            {/* Book Button */}
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={selectedSeats.length === 0 || processing}
                                onClick={() => setShowConfirmModal(true)}
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Pay ₹{finalAmount}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            <BookingConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    if (!processing) {
                        setShowConfirmModal(false);
                    }
                }}
                onConfirm={handleBooking}
                selectedSeats={selectedSeats}
                totalAmount={finalAmount}
                seatPrice={seatPrice}
                convenienceFee={convenienceFee}
                processing={processing}
            />

            {/* Error Modal */}
            {errorModal.show && (
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
                    onClick={() => setErrorModal({ show: false, message: '' })}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: '480px',
                            width: '100%',
                            padding: '32px',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            <AlertTriangle size={32} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>
                            Booking Failed
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                            {errorModal.message}
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setErrorModal({ show: false, message: '' })}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectSeats;
