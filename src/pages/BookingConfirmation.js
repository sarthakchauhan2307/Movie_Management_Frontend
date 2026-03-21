import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingAPI, movieAPI, showAPI } from '../services/api';
import { CheckCircle, Download, Share2, Calendar, Clock, Ticket } from 'lucide-react';


const GATEWAY_BASE_URL = 'http://movieservice.runasp.net';

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

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [movie, setMovie] = useState(null);
    const [show, setShow] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    useEffect(() => {
        loadBookingDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    const loadBookingDetails = async () => {
        try {
            setLoading(true);

            const bookingData = await bookingAPI.getBookingById(bookingId);
            setBooking(bookingData);

            // Load related data
            const [showData, seatsData] = await Promise.all([
                showAPI.getShowById(bookingData.showId),
                bookingAPI.getBookedSeats(bookingId).catch(() => [])
            ]);

            setShow(showData);

            // If no seats from API, try localStorage
            if (!seatsData || seatsData.length === 0) {
                const storedSeats = localStorage.getItem(`booking_${bookingId}_seats`);
                if (storedSeats) {
                    setBookedSeats(JSON.parse(storedSeats));
                } else {
                    setBookedSeats([]);
                }
            } else {
                // API returns array of strings: ["F7", "F9", "F8"]
                setBookedSeats(seatsData);
            }

            if (showData) {
                const movieData = await movieAPI.getMovieById(showData.movieId);
                setMovie(movieData);
            }

            // Load QR code
            try {
                const qrBlob = await bookingAPI.getQrCode(bookingId);
                const qrUrl = URL.createObjectURL(qrBlob);
                setQrCodeUrl(qrUrl);
            } catch (error) {
                console.error('Error loading QR code:', error);
            }

        } catch (error) {
            console.error('Error loading booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadTicket = async () => {
        try {
            setDownloadingPdf(true);
            const pdfBlob = await bookingAPI.downloadTicketPdf(bookingId);

            // Create a download link and trigger it
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Ticket_${bookingId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading ticket:', error);
            alert('Failed to download ticket. Please try again.');
        } finally {
            setDownloadingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="loader">
                <h2 style={{ color: 'var(--error)' }}>Booking not found</h2>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
            padding: '60px 20px'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Success Message */}
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
                        background: 'rgba(34, 197, 94, 0.2)',
                        borderRadius: '50%',
                        marginBottom: '20px'
                    }}>
                        <CheckCircle size={48} color="var(--success)" />
                    </div>
                    <h1 style={{ marginBottom: '12px', fontSize: '2.5rem' }}>
                        {movie && new Date(movie.releaseDate) > new Date()
                            ? 'Advance Booking Confirmed!'
                            : 'Booking Confirmed!'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        {movie && new Date(movie.releaseDate) > new Date()
                            ? `Your advance tickets have been booked! Movie releases on ${new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                            : 'Your tickets have been booked successfully'}
                    </p>
                </div>

                {/* Ticket Card */}
                <div className="card" style={{
                    padding: 0,
                    overflow: 'hidden',
                    marginBottom: '24px'
                }}>
                    {/* Movie Info */}
                    {movie && (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: '24px',
                            borderBottom: '2px dashed var(--border)'
                        }}>
                            <div className="booking-confirm-movie-info">
                                <img
                                    src={
                                        movie.posterUrl
                                            ? `${GATEWAY_BASE_URL}${movie.posterUrl}?v=${movie.modified}`
                                            : 'https://via.placeholder.com/100x150?text=No+Poster'
                                    }
                                    alt={movie.title}
                                    style={{
                                        width: '100px',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <h2 style={{ margin: 0 }}>{movie.title}</h2>
                                        {new Date(movie.releaseDate) > new Date() && (
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
                                        display: 'grid',
                                        gap: '12px',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <span className="badge badge-primary" style={{ width: 'fit-content' }}>
                                            {movie.genre}
                                        </span>
                                        {movie.language && <div>Language: {movie.language}</div>}
                                        {movie.durationMinute && <div>Duration: {movie.durationMinute} mins</div>}
                                        {new Date(movie.releaseDate) > new Date() && (
                                            <div style={{
                                                color: 'var(--warning)',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <Calendar size={16} />
                                                Releases: {new Date(movie.releaseDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Details */}
                    <div style={{ padding: '32px' }}>
                        <div className="booking-details-grid" style={{
                            marginBottom: '32px'
                        }}>
                            <div>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    marginBottom: '8px'
                                }}>
                                    Booking ID
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                    #{booking.bookingId}
                                </div>
                            </div>

                            {show && (
                                <>
                                    <div>
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            marginBottom: '8px'
                                        }}>
                                            <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                            Show Date
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                            {new Date(show.showDate).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            marginBottom: '8px'
                                        }}>
                                            <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                            Show Time
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                            {formatShowTime(show.showTime)}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    marginBottom: '8px'
                                }}>
                                    <Ticket size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                    Seats
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {bookedSeats.map((seatNo, index) => (
                                        <span key={index} className="badge badge-primary">
                                            {seatNo}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: '32px',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '200px',
                                height: '200px',
                                background: 'white',
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden'
                            }}>
                                {qrCodeUrl ? (
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <div style={{ color: '#666' }}>Loading QR...</div>
                                )}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Scan this QR code at the theatre
                            </p>
                        </div>

                        {/* Total Amount */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '20px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px'
                        }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Total Amount Paid</span>
                            <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary)' }}>
                                ₹{booking.totalAmount}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="booking-actions-grid">
                            <button
                                className="btn btn-secondary"
                                onClick={downloadTicket}
                                disabled={downloadingPdf}
                            >
                                <Download size={18} />
                                {downloadingPdf ? 'Downloading...' : 'Download PDF'}
                            </button>
                            <button className="btn btn-secondary">
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center'
                }}>
                    <Link to="/" className="btn btn-ghost">
                        Book More Tickets
                    </Link>
                    <Link to="/my-bookings" className="btn btn-primary">
                        View All Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
