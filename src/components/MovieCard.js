import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Star } from 'lucide-react';

const API_BASE_URL = 'http://movieservice.runasp.net';

const MovieCard = ({ movie, hasShows = false }) => {
    // Construct full poster URL
    const getPosterUrl = () => {
        if (!movie.posterUrl) {
            return 'https://via.placeholder.com/400x600?text=No+Poster';
        }

        // If posterUrl starts with http/https, use it as is
        if (movie.posterUrl.startsWith('http')) {
            return movie.posterUrl;
        }

        // Otherwise, prepend the API base URL
        return `${API_BASE_URL}${movie.posterUrl}`;
    };

    return (
        <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', display: 'block', height: '100%', minWidth: 0 }}>
            <div className="card card-hover" style={{
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Poster */}
                <div style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    background: 'var(--bg-secondary)',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    <img
                        src={getPosterUrl()}
                        alt={movie.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                        }}
                    />

                    {/* Overlay Gradient */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                        pointerEvents: 'none'
                    }} />

                    {/* Coming Soon Badge */}
                    {new Date(movie.releaseDate) > new Date() && (
                        <>
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                padding: '6px 12px',
                                background: 'var(--warning)',
                                color: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Coming Soon
                            </div>

                            {/* Advance Booking Open Badge */}
                            {hasShows && (
                                <div style={{
                                    position: 'absolute',
                                    top: '48px',
                                    left: '12px',
                                    padding: '6px 12px',
                                    background: 'var(--success)',
                                    color: 'var(--bg-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Advance Booking
                                </div>
                            )}
                        </>
                    )}

                    {/* Rating Badge */}
                    {movie.rating && (
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                            <span>{movie.rating}/10</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {movie.title}
                    </h3>

                    {/* Genre */}
                    <div style={{
                        marginBottom: '12px',
                        minHeight: '24px'
                    }}>
                        <span className="badge badge-primary" style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                            display: 'inline-block'
                        }}>
                            {movie.genre}
                        </span>
                    </div>

                    {/* Spacer to push meta to bottom */}
                    <div style={{ flex: 1 }} />

                    {/* Meta Info - pushed to bottom */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        marginTop: 'auto'
                    }}>
                        {movie.duration && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} />
                                <span>{movie.duration}m</span>
                            </div>
                        )}
                        {movie.releaseDate && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} />
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                        )}
                    </div>

                    {/* Languages (if available) */}
                    {movie.language && (
                        <div style={{
                            marginTop: '8px',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {movie.language}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
