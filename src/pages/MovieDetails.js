import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieAPI, showAPI } from '../services/api';
import TrailerPlayer from '../components/TrailerPlayer';
import MovieReviewSection from '../components/MovieReviewSection';
import NoShowsModal from '../components/NoShowsModal';
import {
    Calendar,
    Clock,
    Star,
    Languages,
    ArrowLeft,
    Ticket,
    Play
} from 'lucide-react';

const API_BASE_URL = 'http://movieservice.runasp.net';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [hasUpcomingShows, setHasUpcomingShows] = useState(true);
    const [checkingShows, setCheckingShows] = useState(false);
    const [showNoShowsModal, setShowNoShowsModal] = useState(false);

    const checkShowAvailability = useCallback(async () => {
        try {
            setCheckingShows(true);
            const shows = await showAPI.getShowsByMovieId(id);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tenDaysLater = new Date();
            tenDaysLater.setDate(tenDaysLater.getDate() + 10);
            tenDaysLater.setHours(23, 59, 59, 999);

            const upcomingShows = shows.filter(show => {
                const showDate = new Date(show.showDate);
                showDate.setHours(0, 0, 0, 0);
                return showDate >= today && showDate <= tenDaysLater;
            });

            setHasUpcomingShows(upcomingShows.length > 0);
        } catch (err) {
            console.error('Failed to check show availability:', err);
            setHasUpcomingShows(true);
        } finally {
            setCheckingShows(false);
        }
    }, [id]);

    const loadMovie = useCallback(async () => {
        try {
            setLoading(true);
            const data = await movieAPI.getMovieById(id);
            setMovie(data);
            setError(null);
            await checkShowAvailability();
        } catch (err) {
            console.error('Failed to load movie:', err);
            setError('Failed to load movie details');
        } finally {
            setLoading(false);
        }
    }, [id, checkShowAvailability]);

    useEffect(() => {
        loadMovie();
    }, [loadMovie]);

    // Construct full poster URL
    const getPosterUrl = (posterUrl) => {
        if (!posterUrl) {
            return 'https://via.placeholder.com/300x450?text=No+Poster';
        }

        // If posterUrl starts with http/https, use it as is
        if (posterUrl.startsWith('http')) {
            return posterUrl;
        }

        // Otherwise, prepend the API base URL
        return `${API_BASE_URL}${posterUrl}`;
    };


    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="loader">
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>
                        {error || 'Movie not found'}
                    </h2>
                    <Link to="/" className="btn btn-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const isUpcoming = new Date(movie.releaseDate) > new Date();

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                minHeight: '70vh',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
            }}>
                {/* Backdrop Image */}
                {movie.trailerUrl && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.3,
                        filter: 'blur(20px) brightness(0.5)'
                    }}>
                        <img
                            src={getPosterUrl(movie.posterUrl)}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)'
                }} />

                {/* Content */}
                <div className="container" style={{
                    position: 'relative',
                    paddingTop: '40px',
                    paddingBottom: '60px'
                }}>
                    {/* Back Button */}
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        marginBottom: '32px',
                        transition: 'var(--transition)'
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                        <ArrowLeft size={20} />
                        <span>Back to Movies</span>
                    </Link>

                    <div className="movie-details-grid">
                        {/* Poster */}
                        <div className="card movie-details-poster" style={{
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                        }}>
                            <img
                                src={getPosterUrl(movie.posterUrl)}
                                alt={movie.title}
                                style={{
                                    width: '100%',
                                    display: 'block'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                                }}
                            />
                        </div>

                        {/* Movie Info */}
                        <div className="movie-details-info">
                            <h1 className="movie-details-title">
                                {movie.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="movie-details-meta" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '24px',
                                marginBottom: '24px',
                                color: 'var(--text-secondary)'
                            }}>
                                {movie.rating && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Star size={20} fill="#fbbf24" color="#fbbf24" />
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
                                            {movie.rating}/10
                                        </span>
                                    </div>
                                )}
                                {movie.genre && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                                            {movie.genre}
                                        </span>
                                    </div>
                                )}
                                {movie.durationMinute && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={18} />
                                        <span>{movie.durationMinute} mins</span>
                                    </div>
                                )}
                                {movie.releaseDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={18} />
                                        <span>{new Date(movie.releaseDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                )}
                                {movie.language && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Languages size={18} />
                                        <span>{movie.language}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {movie.description && (
                                <div style={{ marginBottom: '32px' }}>
                                    <h3 style={{ marginBottom: '12px' }}>About the Movie</h3>
                                    <p style={{
                                        lineHeight: 1.8,
                                        color: 'var(--text-secondary)',
                                        fontSize: '1.05rem',
                                        maxWidth: '800px'
                                    }}>
                                        {movie.description}
                                    </p>
                                </div>
                            )}

                            {/* Cast & Crew */}
                            {(movie.director || movie.actor || movie.actress) && (
                                <div style={{ marginBottom: '32px' }}>
                                    <h3 style={{ marginBottom: '12px' }}>Cast & Crew</h3>
                                    <div style={{
                                        display: 'grid',
                                        gap: '8px',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {movie.director && (
                                            <div>
                                                <strong style={{ color: 'white' }}>Director:</strong> {movie.director}
                                            </div>
                                        )}
                                        {movie.actor && (
                                            <div>
                                                <strong style={{ color: 'white' }}>Cast:</strong> {movie.actor}
                                                {movie.actress && `, ${movie.actress}`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="movie-details-cta" style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => {
                                        if (!hasUpcomingShows) {
                                            setShowNoShowsModal(true);
                                        } else {
                                            navigate(`/movie/${movie.movieId}/shows`);
                                        }
                                    }}
                                    style={{
                                        opacity: checkingShows ? 0.6 : 1,
                                        cursor: checkingShows ? 'wait' : 'pointer'
                                    }}
                                >
                                    <Ticket size={20} />
                                    {checkingShows ? 'Checking...' : (isUpcoming ? 'Book Advance Tickets' : 'Book Tickets')}
                                </button>

                                {/* Watch Trailer Button */}
                                {movie.trailerUrl && (
                                    <button
                                        className="btn btn-secondary btn-lg"
                                        onClick={() => setShowTrailer(true)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Play size={20} />
                                        Watch Trailer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <MovieReviewSection movieId={id} />

            {/* Trailer Player Modal */}
            <TrailerPlayer
                trailerUrl={movie.trailerUrl}
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
            />

            {/* No Shows Available Modal */}
            <NoShowsModal
                isOpen={showNoShowsModal}
                onClose={() => setShowNoShowsModal(false)}
                movieTitle={movie.title}
            />
        </div>
    );
};

export default MovieDetails;
