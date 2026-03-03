import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { TrendingUp, Search, ArrowUpDown } from 'lucide-react';

const UserMovieCollection = () => {
    const [loading, setLoading] = useState(true);
    const [collectionData, setCollectionData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        loadCollectionData();
    }, []);

    const loadCollectionData = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.getMovieWiseCollection();
            const filteredData = data.filter(movie => movie.movieCollection > 0);
            // Default sort: highest first
            filteredData.sort((a, b) => b.movieCollection - a.movieCollection);
            setCollectionData(filteredData);
        } catch (error) {
            console.error('Error loading collection data:', error);
            setCollectionData([]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const totalCollection = collectionData.reduce((sum, m) => sum + m.movieCollection, 0);
    const avgCollection = collectionData.length > 0 ? totalCollection / collectionData.length : 0;
    const topMovie = collectionData.length > 0
        ? collectionData.reduce((max, m) => m.movieCollection > max.movieCollection ? m : max)
        : null;

    const filteredMovies = collectionData
        .filter(m => m.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortAsc
            ? a.movieCollection - b.movieCollection
            : b.movieCollection - a.movieCollection
        );

    const getRankIcon = (index) => {
        if (index === 0) return 'emoji_events';       // Gold trophy
        if (index === 1) return 'workspace_premium';   // Silver medal
        if (index === 2) return 'military_tech';       // Bronze medal
        return null;
    };

    const getRankColor = (index) => {
        if (index === 0) return '#FFD700';
        if (index === 1) return '#C0C0C0';
        if (index === 2) return '#CD7F32';
        return 'var(--text-muted)';
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                padding: '60px 0 40px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-80px',
                    right: '-80px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-60px',
                    left: '-60px',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <div className="container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <TrendingUp size={32} color="white" />
                        </div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Box Office Collection
                        </h1>
                    </div>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '600px'
                    }}>
                        Explore how your favorite movies are performing at the box office.
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 20px 80px' }}>
                {/* Summary Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* Total Collection */}
                    <div className="collection-stat-card">
                        <div className="collection-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>
                            <span className="material-icons" style={{ color: 'var(--success)', fontSize: '28px' }}>account_balance_wallet</span>
                        </div>
                        <p className="collection-stat-label">Total Collection</p>
                        <h3 className="collection-stat-value" style={{ color: 'var(--success)' }}>
                            {formatCurrency(totalCollection)}
                        </h3>
                    </div>

                    {/* Total Movies */}
                    <div className="collection-stat-card">
                        <div className="collection-stat-icon" style={{ background: 'rgba(220, 38, 38, 0.12)' }}>
                            <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '28px' }}>movie</span>
                        </div>
                        <p className="collection-stat-label">Total Movies</p>
                        <h3 className="collection-stat-value" style={{ color: 'var(--primary)' }}>
                            {collectionData.length}
                        </h3>
                    </div>

                    {/* Average Collection */}
                    <div className="collection-stat-card">
                        <div className="collection-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
                            <span className="material-icons" style={{ color: '#818cf8', fontSize: '28px' }}>analytics</span>
                        </div>
                        <p className="collection-stat-label">Average Collection</p>
                        <h3 className="collection-stat-value" style={{ color: '#818cf8' }}>
                            {formatCurrency(avgCollection)}
                        </h3>
                    </div>

                    {/* Top Performer */}
                    <div className="collection-stat-card">
                        <div className="collection-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
                            <span className="material-icons" style={{ color: 'var(--warning)', fontSize: '28px' }}>emoji_events</span>
                        </div>
                        <p className="collection-stat-label">Top Performer</p>
                        <h3 className="collection-stat-value collection-stat-truncate" style={{ color: 'var(--warning)' }}>
                            {topMovie?.title || 'N/A'}
                        </h3>
                        {topMovie && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {formatCurrency(topMovie.movieCollection)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Controls Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    gap: '16px',
                    flexWrap: 'wrap'
                }}>
                    <h2 style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                    }}>
                        All Movies <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1rem' }}>({filteredMovies.length})</span>
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} size={18} />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '10px 16px 10px 40px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    width: '240px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        {/* Sort Toggle */}
                        <button
                            onClick={() => setSortAsc(!sortAsc)}
                            className="collection-sort-btn"
                        >
                            <ArrowUpDown size={16} />
                            {sortAsc ? 'Lowest First' : 'Highest First'}
                        </button>
                    </div>
                </div>

                {/* Movie Collection Cards Grid */}
                {filteredMovies.length > 0 ? (
                    <div className="collection-grid">
                        {filteredMovies.map((movie, index) => {
                            const percentage = totalCollection > 0
                                ? (movie.movieCollection / totalCollection) * 100
                                : 0;
                            const isTop3 = index < 3;
                            const rankIcon = getRankIcon(index);
                            const rankColor = getRankColor(index);

                            return (
                                <div
                                    key={`${movie.title}-${index}`}
                                    className={`collection-movie-card ${isTop3 ? 'collection-movie-card-top' : ''}`}
                                    style={{
                                        animationDelay: `${index * 0.05}s`
                                    }}
                                >
                                    {/* Rank Badge */}
                                    <div className="collection-rank-badge" style={{
                                        background: isTop3
                                            ? `linear-gradient(135deg, ${rankColor}22, ${rankColor}44)`
                                            : 'var(--bg-secondary)',
                                        borderColor: isTop3 ? `${rankColor}66` : 'var(--border)'
                                    }}>
                                        {rankIcon ? (
                                            <span className="material-icons" style={{
                                                color: rankColor,
                                                fontSize: '24px',
                                                filter: isTop3 ? `drop-shadow(0 0 6px ${rankColor}88)` : 'none'
                                            }}>
                                                {rankIcon}
                                            </span>
                                        ) : (
                                            <span style={{
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                #{index + 1}
                                            </span>
                                        )}
                                    </div>

                                    {/* Movie Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 className="collection-movie-title">
                                            {movie.title}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: '8px',
                                            marginTop: '6px'
                                        }}>
                                            <span className="collection-movie-amount" style={{
                                                color: isTop3 ? 'var(--success)' : 'var(--text-primary)'
                                            }}>
                                                {formatCurrency(movie.movieCollection)}
                                            </span>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--text-muted)',
                                                fontWeight: 500
                                            }}>
                                                {percentage.toFixed(1)}% share
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="collection-progress-track">
                                            <div
                                                className="collection-progress-fill"
                                                style={{
                                                    width: `${Math.max(percentage, 2)}%`,
                                                    background: isTop3
                                                        ? `linear-gradient(90deg, var(--primary), ${rankColor})`
                                                        : 'var(--primary)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: 'var(--text-secondary)'
                    }}>
                        <span className="material-icons" style={{ fontSize: '64px', color: 'var(--text-muted)', marginBottom: '16px', display: 'block' }}>
                            leaderboard
                        </span>
                        <h3 style={{ marginBottom: '8px', fontWeight: 600 }}>No Collection Data</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {searchTerm ? 'No movies match your search.' : 'Collection data will appear here once bookings are made.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Inline Styles via <style> tag for animations & card effects */}
            <style>{`
                .collection-stat-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    transition: var(--transition);
                    position: relative;
                    overflow: hidden;
                }
                .collection-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .collection-stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                    border-color: rgba(255, 255, 255, 0.08);
                }
                .collection-stat-card:hover::before {
                    opacity: 1;
                }
                .collection-stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }
                .collection-stat-label {
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 6px;
                }
                .collection-stat-value {
                    font-size: 1.6rem;
                    font-weight: 700;
                    line-height: 1.2;
                }
                .collection-stat-truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 1.2rem;
                }
                .collection-sort-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                }
                .collection-sort-btn:hover {
                    border-color: var(--primary);
                    background: rgba(220, 38, 38, 0.08);
                }
                .collection-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                @media (max-width: 768px) {
                    .collection-grid {
                        grid-template-columns: 1fr;
                    }
                    .collection-stat-card {
                        padding: 16px;
                    }
                }
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: repeat(4"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 480px) {
                    div[style*="grid-template-columns: repeat(4"] {
                        grid-template-columns: 1fr !important;
                    }
                }
                .collection-movie-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: collectionFadeIn 0.4s ease forwards;
                    opacity: 0;
                }
                .collection-movie-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
                    border-color: rgba(255, 255, 255, 0.06);
                }
                .collection-movie-card-top {
                    border-color: rgba(255, 255, 255, 0.06);
                    background: linear-gradient(135deg, var(--bg-card) 0%, rgba(26, 26, 26, 0.95) 100%);
                }
                .collection-movie-card-top:hover {
                    box-shadow: 0 8px 30px rgba(220, 38, 38, 0.15);
                }
                @keyframes collectionFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .collection-rank-badge {
                    width: 52px;
                    height: 52px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border);
                    flex-shrink: 0;
                    transition: var(--transition);
                }
                .collection-movie-card:hover .collection-rank-badge {
                    transform: scale(1.08);
                }
                .collection-movie-title {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.3;
                }
                .collection-movie-amount {
                    font-size: 1.15rem;
                    font-weight: 700;
                }
                .collection-progress-track {
                    width: 100%;
                    height: 6px;
                    background: var(--bg-secondary);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 10px;
                }
                .collection-progress-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
};

export default UserMovieCollection;
