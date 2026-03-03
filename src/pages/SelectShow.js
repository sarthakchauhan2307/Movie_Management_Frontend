import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, showAPI, theatreAPI, screenAPI } from '../services/api';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const SelectShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [theatres, setTheatres] = useState({});
    const [screens, setScreens] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(0);

    // Generate next 10 days
    const dates = Array.from({ length: 10 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: d
        };
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load movie details, shows, screens, and theatres
            const [movieData, showsData, screensData, theatresData] = await Promise.all([
                movieAPI.getMovieById(id),
                showAPI.getShowsByMovieId(id),
                screenAPI.getScreens(),
                theatreAPI.getTheatres()
            ]);

            setMovie(movieData);
            setShows(showsData);

            // Create theatre lookup
            const theatreMap = {};
            theatresData.forEach(theatre => {
                theatreMap[theatre.theatreId] = theatre;
            });
            setTheatres(theatreMap);

            // Create screen lookup with theatre reference
            const screenMap = {};
            screensData.forEach(screen => {
                screenMap[screen.screenId] = {
                    ...screen,
                    theatre: theatreMap[screen.theatreId]
                };
            });
            setScreens(screenMap);

        } catch (error) {
            console.error('Error loading show data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getShowsForDate = () => {
        const selected = dates[selectedDate].fullDate;
        const now = new Date();

        return shows.filter(show => {
            const showDate = new Date(show.showDate);

            // Check if the show is on the selected date
            if (showDate.toDateString() !== selected.toDateString()) {
                return false;
            }

            // Parse show time and create a full datetime
            const [hours, minutes] = show.showTime.split(':').map(Number);
            const showDateTime = new Date(showDate);
            showDateTime.setHours(hours, minutes, 0);

            // Only show future shows (allow shows starting within the next 15 minutes as buffer)
            const bufferTime = 15 * 60 * 1000; // 15 minutes in milliseconds
            return showDateTime.getTime() > (now.getTime() - bufferTime);
        });
    };

    const groupShowsByTheatre = () => {
        const showsForDate = getShowsForDate();
        const grouped = {};

        showsForDate.forEach(show => {
            // Get theatre ID from screen
            const screen = screens[show.screenId];
            if (!screen || !screen.theatre) return;

            const theatreId = screen.theatre.theatreId;
            if (!grouped[theatreId]) {
                grouped[theatreId] = {
                    theatre: screen.theatre,
                    shows: []
                };
            }
            grouped[theatreId].shows.push({ ...show, screen });
        });

        return grouped;
    };

    const formatTime = (timeString) => {
        // Handle time in format "HH:MM:SS"
        if (typeof timeString === 'string' && timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const minute = minutes;
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minute} ${period}`;
        }
        // Fallback to Date parsing
        const time = new Date(timeString);
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="loader">
                <h2 style={{ color: 'var(--error)' }}>Movie not found</h2>
            </div>
        );
    }

    const groupedShows = groupShowsByTheatre();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Movie Header */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '24px 0'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            style={{
                                width: '80px',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)'
                            }}
                        />
                        <div>
                            <h2 style={{ marginBottom: '8px' }}>{movie.title}</h2>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem'
                            }}>
                                <span className="badge badge-primary">{movie.genre}</span>
                                {movie.durationMinute && <span>{movie.durationMinute} mins</span>}
                                {movie.language && <span>{movie.language}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advance Booking Alert Banner */}
            {movie && new Date(movie.releaseDate) > new Date() && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                    borderBottom: '2px solid var(--warning)',
                    padding: '16px 0'
                }}>
                    <div className="container">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: 'var(--warning)'
                        }}>
                            <Calendar size={20} />
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                                    Advance Booking
                                </span>
                                <span style={{
                                    marginLeft: '8px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    This movie releases on {new Date(movie.releaseDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Selector */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '20px 0',
                position: 'sticky',
                top: '73px',
                zIndex: 999
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        paddingBottom: '4px'
                    }}>
                        {dates.map((date, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(index)}
                                className={`chip ${selectedDate === index ? 'active' : ''}`}
                                style={{
                                    minWidth: '100px',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    padding: '12px 16px'
                                }}
                            >
                                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                    {date.day}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                    {date.date}
                                </div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                    {date.month}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shows by Theatre */}
            <div className="container" style={{ padding: '40px 20px' }}>
                <h2 style={{ marginBottom: '24px' }}>
                    Select Show Time - {dates[selectedDate].day}, {dates[selectedDate].date} {dates[selectedDate].month}
                </h2>

                {Object.keys(groupedShows).length === 0 ? (
                    <div className="card" style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        <h3>No shows available for this date</h3>
                        <p>Please try selecting a different date from the options above</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {Object.entries(groupedShows).map(([theatreId, { theatre, shows: theatreShows }]) => (
                            <div key={theatreId} className="card" style={{ padding: '24px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '20px'
                                }}>
                                    <div>
                                        <h3 style={{ marginBottom: '8px' }}>
                                            {theatre.theatreName || `Theatre #${theatreId}`}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            <MapPin size={16} />
                                            <span>
                                                {theatre.city ? `${theatre.city}${theatre.address ? ', ' + theatre.address : ''}` : theatre.address || 'Location not available'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Show Times */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }}>
                                    {theatreShows.map(show => (
                                        <button
                                            key={show.showId}
                                            onClick={() => navigate(`/show/${show.showId}/seats`)}
                                            className="btn btn-ghost"
                                            style={{
                                                minWidth: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '12px 20px'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '1.05rem',
                                                fontWeight: '600'
                                            }}>
                                                <Clock size={16} />
                                                {formatTime(show.showTime)}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {show.screen?.seatCount ? `${show.screen.seatCount - (show.bookedSeats || 0)} seats` : 'Check availability'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectShow;
