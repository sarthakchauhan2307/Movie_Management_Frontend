import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, movieAPI, showAPI, screenAPI, theatreAPI } from '../services/api';
import { Calendar, Clock, MapPin, QrCode, Ticket, Film, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [enrichedBookings, setEnrichedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming or past
    const [qrCodes, setQrCodes] = useState({}); // Store QR code URLs by booking ID
    const [downloadingPdf, setDownloadingPdf] = useState({}); // Track PDF download state by booking ID

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const bookingsData = await bookingAPI.getUserBookings(user.userId); // Use authenticated user ID

            // Enrich bookings with movie, show, screen and theatre data
            const enriched = await Promise.all(
                bookingsData.map(async (booking) => {
                    try {
                        const [showData, seatsData] = await Promise.all([
                            showAPI.getShowById(booking.showId),
                            bookingAPI.getBookedSeats(booking.bookingId)
                        ]);

                        let movieData = null;
                        let screenData = null;
                        let theatreData = null;

                        if (showData) {
                            // Get movie - handle case sensitivity
                            const movieId = showData.movieId || showData.MovieId;
                            if (movieId) {
                                movieData = await movieAPI.getMovieById(movieId);
                            }

                            // Get screen and theatre
                            try {
                                const screenId = showData.screenId || showData.ScreenId;
                                screenData = await screenAPI.getScreenById(screenId);
                                if (screenData) {
                                    const theatreId = screenData.theatreId || screenData.TheatreId;
                                    theatreData = await theatreAPI.getTheatreById(theatreId);
                                }
                            } catch (error) {
                                console.error('Error fetching screen/theatre:', error);
                            }
                        }

                        return {
                            ...booking,
                            show: showData,
                            movie: movieData,
                            screen: screenData,
                            theatre: theatreData,
                            seats: seatsData
                        };
                    } catch (error) {
                        console.error(`Error enriching booking ${booking.bookingId}:`, error);
                        return booking;
                    }
                })
            );

            // Sort enriched bookings by bookingId (latest first)
            enriched.sort((a, b) => b.bookingId - a.bookingId);
            setEnrichedBookings(enriched);
            setBookings(bookingsData);

            // Load QR codes for all bookings
            loadQrCodes(enriched);

        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadQrCodes = async (bookings) => {
        const qrCodeMap = {};
        await Promise.all(
            bookings.map(async (booking) => {
                try {
                    const qrBlob = await bookingAPI.getQrCode(booking.bookingId);
                    qrCodeMap[booking.bookingId] = URL.createObjectURL(qrBlob);
                } catch (error) {
                    console.error(`Error loading QR code for booking ${booking.bookingId}:`, error);
                }
            })
        );
        setQrCodes(qrCodeMap);
    };

    const downloadTicketPdf = async (bookingId) => {
        try {
            setDownloadingPdf(prev => ({ ...prev, [bookingId]: true }));
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
            setDownloadingPdf(prev => ({ ...prev, [bookingId]: false }));
        }
    };

    const getFilteredBookings = () => {
        const now = new Date();
        return enrichedBookings.filter(booking => {
            if (!booking.show) return activeTab === 'past';

            // Combine date and time for accurate comparison
            const showDate = new Date(booking.show.showDate || booking.show.ShowDate);
            const showTime = booking.show.showTime || booking.show.ShowTime;

            if (showTime) {
                // Parse time (format: "HH:MM:SS" or "HH:MM")
                const [hours, minutes] = showTime.split(':').map(Number);
                showDate.setHours(hours, minutes, 0, 0);
            }

            // Compare complete datetime: upcoming if show hasn't started yet
            return activeTab === 'upcoming' ? showDate >= now : showDate < now;
        });
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    const filteredBookings = getFilteredBookings();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
            paddingBottom: '60px'
        }}>
            <div className="container" style={{ padding: '40px 20px' }}>
                {/* Header */}
                <div className="my-bookings-header" style={{ marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ marginBottom: '8px' }}>My Bookings</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            View and manage your ticket bookings
                        </p>
                    </div>
                    <Link to="/" className="btn btn-primary">
                        <Film size={18} />
                        Book New Tickets
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '32px',
                    borderBottom: '2px solid var(--border)'
                }}>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `3px solid ${activeTab === 'upcoming' ? 'var(--primary)' : 'transparent'}`,
                            color: activeTab === 'upcoming' ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'upcoming' ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            marginBottom: '-2px'
                        }}
                    >
                        Upcoming Shows ({enrichedBookings.filter(b => {
                            if (!b.show) return false;
                            const showDateTime = new Date(b.show.showDate || b.show.ShowDate);
                            const showTime = b.show.showTime || b.show.ShowTime;
                            if (showTime) {
                                const [hours, minutes] = showTime.split(':').map(Number);
                                showDateTime.setHours(hours, minutes, 0, 0);
                            }
                            return showDateTime >= new Date();
                        }).length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `3px solid ${activeTab === 'past' ? 'var(--primary)' : 'transparent'}`,
                            color: activeTab === 'past' ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'past' ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            marginBottom: '-2px'
                        }}
                    >
                        Past Shows ({enrichedBookings.filter(b => {
                            if (!b.show) return false;
                            const showDateTime = new Date(b.show.showDate || b.show.ShowDate);
                            const showTime = b.show.showTime || b.show.ShowTime;
                            if (showTime) {
                                const [hours, minutes] = showTime.split(':').map(Number);
                                showDateTime.setHours(hours, minutes, 0, 0);
                            }
                            return showDateTime < new Date();
                        }).length})
                    </button>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="card" style={{
                        padding: '60px 20px',
                        textAlign: 'center'
                    }}>
                        <Ticket size={64} color="var(--text-muted)" style={{ margin: '0 auto 20px' }} />
                        <h3 style={{ marginBottom: '12px' }}>No {activeTab} bookings</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            {activeTab === 'upcoming'
                                ? "You haven't booked any upcoming shows yet"
                                : "You don't have any past bookings"}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link to="/" className="btn btn-primary">
                                Book Your First Show
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {filteredBookings.map(booking => (
                            <div key={booking.bookingId} className="card card-hover my-booking-card" style={{
                                padding: 0
                            }}>
                                {/* Movie Poster */}
                                {booking.movie && (
                                    <div className="my-booking-poster" style={{
                                        background: 'var(--bg-secondary)'
                                    }}>
                                        <img
                                            src={
                                                booking.movie.posterUrl
                                                    ? `${GATEWAY_BASE_URL}${booking.movie.posterUrl}?v=${booking.movie.modified}`
                                                    : booking.movie.PosterUrl
                                                        ? `${GATEWAY_BASE_URL}${booking.movie.PosterUrl}?v=${booking.movie.modified}`
                                                        : 'https://via.placeholder.com/140x210?text=No+Poster'
                                            }
                                            alt={booking.movie.title || booking.movie.Title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />

                                    </div>
                                )}

                                {/* Booking Details */}
                                <div style={{ padding: '24px' }}>
                                    {booking.movie && (
                                        <h3 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>
                                            {booking.movie.title}
                                        </h3>
                                    )}

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '16px',
                                        marginBottom: '16px',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.95rem'
                                    }}>
                                        {booking.show && (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={16} />
                                                    <span>{new Date(booking.show.showDate).toLocaleDateString('en-IN', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={16} />
                                                    <span>{formatShowTime(booking.show.showTime)}</span>
                                                </div>
                                            </>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} />
                                            <span>{booking.theatre?.theatreName || 'Theatre'}</span>
                                        </div>
                                    </div>

                                    {/* Seats */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            Seats:
                                        </span>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            marginTop: '8px'
                                        }}>
                                            {booking.seats && booking.seats.length > 0 ? (
                                                booking.seats.map((seatNo, index) => (
                                                    <span key={index} className="badge badge-primary">
                                                        {seatNo}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="badge badge-primary">
                                                    {booking.seatCount} seats
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Booking ID & Amount */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '24px',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        <span>Booking ID: #{booking.bookingId}</span>
                                        <span style={{ color: 'white', fontWeight: '600' }}>
                                            Amount: ₹{booking.totalAmount}
                                        </span>
                                        <span className={`badge ${booking.status === 'Confirmed' ? 'badge-success' : 'badge-primary'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* QR Code & Actions */}
                                <div className="my-booking-qr">
                                    {/* QR Code Image */}
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        padding: '4px'
                                    }}>
                                        {qrCodes[booking.bookingId] ? (
                                            <img
                                                src={qrCodes[booking.bookingId]}
                                                alt="QR Code"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        ) : (
                                            <QrCode size={60} color="#666" />
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <button
                                        onClick={() => downloadTicketPdf(booking.bookingId)}
                                        className="btn btn-primary btn-sm"
                                        disabled={downloadingPdf[booking.bookingId]}
                                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                                    >
                                        <Download size={14} />
                                        {downloadingPdf[booking.bookingId] ? 'Downloading...' : 'Download PDF'}
                                    </button>
                                    <Link
                                        to={`/booking/confirmation/${booking.bookingId}`}
                                        className="btn btn-secondary btn-sm"
                                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
