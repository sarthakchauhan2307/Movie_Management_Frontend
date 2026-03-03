import React, { useState, useEffect } from 'react';
import { adminAnalyticsAPI } from '../../services/adminApi';
import '../../styles/admin.css';

const MovieCollection = () => {
    const [loading, setLoading] = useState(true);
    const [collectionData, setCollectionData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'movieCollection', direction: 'desc' });

    useEffect(() => {
        loadCollectionData();
    }, []);

    const loadCollectionData = async () => {
        try {
            setLoading(true);
            const data = await adminAnalyticsAPI.getMovieWiseCollection();
            // Filter out movies with zero collection
            const filteredData = data.filter(movie => movie.movieCollection > 0);
            setCollectionData(filteredData);
        } catch (error) {
            console.error('Error loading collection data:', error);
            setCollectionData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        const sorted = [...filteredMovies].sort((a, b) => {
            if (sortConfig.key === 'movieCollection') {
                return sortConfig.direction === 'asc'
                    ? a.movieCollection - b.movieCollection
                    : b.movieCollection - a.movieCollection;
            } else {
                const aValue = a[sortConfig.key]?.toLowerCase() || '';
                const bValue = b[sortConfig.key]?.toLowerCase() || '';
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
        return sorted;
    };

    const filteredMovies = collectionData.filter(movie =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = getSortedData();

    const totalCollection = collectionData.reduce((sum, movie) => sum + movie.movieCollection, 0);
    const avgCollection = collectionData.length > 0 ? totalCollection / collectionData.length : 0;
    const topMovie = collectionData.length > 0 ? collectionData.reduce((max, movie) =>
        movie.movieCollection > max.movieCollection ? movie : max
    ) : null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
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
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                    Movie Collection Analytics
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Comprehensive box office performance data for all movies
                </p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '2.5rem' }}>💰</div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                                Total Collection
                            </p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                                {formatCurrency(totalCollection)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '2.5rem' }}>🎬</div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                                Total Movies
                            </p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                                {collectionData.length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '2.5rem' }}>📊</div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                                Average Collection
                            </p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--info)' }}>
                                {formatCurrency(avgCollection)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '2.5rem' }}>🏆</div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                                Top Performer
                            </p>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--warning)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {topMovie?.title || 'N/A'}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {topMovie ? formatCurrency(topMovie.movieCollection) : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collection Table */}
            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Movie Collections ({sortedData.length})</h2>
                    <div className="table-actions">
                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {sortedData.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Rank</th>
                                    <th
                                        onClick={() => handleSort('title')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                    >
                                        Movie Title {getSortIcon('title')}
                                    </th>
                                    <th
                                        onClick={() => handleSort('movieCollection')}
                                        style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}
                                    >
                                        Collection {getSortIcon('movieCollection')}
                                    </th>
                                    <th style={{ textAlign: 'right' }}>% of Total</th>
                                    <th style={{ textAlign: 'center' }}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((movie, index) => {
                                    const percentage = (movie.movieCollection / totalCollection) * 100;
                                    const isTop3 = index < 3;

                                    return (
                                        <tr key={`${movie.title}-${index}`}>
                                            <td style={{ textAlign: 'center' }}>
                                                {index === 0 && <span style={{ fontSize: '1.5rem' }}>🥇</span>}
                                                {index === 1 && <span style={{ fontSize: '1.5rem' }}>🥈</span>}
                                                {index === 2 && <span style={{ fontSize: '1.5rem' }}>🥉</span>}
                                                {index > 2 && <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{index + 1}</span>}
                                            </td>
                                            <td style={{ fontWeight: isTop3 ? 700 : 600 }}>
                                                {movie.title}
                                            </td>
                                            <td style={{
                                                textAlign: 'right',
                                                fontWeight: 700,
                                                color: isTop3 ? 'var(--success)' : 'inherit',
                                                fontSize: isTop3 ? '1.05rem' : '1rem'
                                            }}>
                                                {formatCurrency(movie.movieCollection)}
                                            </td>
                                            <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                                                {percentage.toFixed(1)}%
                                            </td>
                                            <td>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{
                                                        width: '100px',
                                                        height: '8px',
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <div style={{
                                                            width: `${percentage}%`,
                                                            height: '100%',
                                                            background: isTop3
                                                                ? 'linear-gradient(90deg, var(--success), var(--primary))'
                                                                : 'var(--primary)',
                                                            borderRadius: '4px',
                                                            transition: 'width 0.3s ease'
                                                        }} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3 className="empty-state-title">No Collection Data</h3>
                        <p className="empty-state-description">
                            {searchTerm ? 'No movies match your search.' : 'Movie collection data will appear here once bookings are made.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCollection;
