import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI, showAPI, screenAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { Film, ArrowLeft } from 'lucide-react';
import { useCity } from '../context/CityContext';

const AllMovies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedCity } = useCity();
    const [movieCityMap, setMovieCityMap] = useState({});
    const [shows, setShows] = useState([]);

    const [filters, setFilters] = useState({
        status: 'all',
        genre: null
    });

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movies, filters, selectedCity, movieCityMap, shows]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [moviesData, screensData, showsData] = await Promise.all([
                movieAPI.getMovies(),
                screenAPI.getScreens(),
                showAPI.getShows()
            ]);

            const { theatreAPI } = require('../services/api');
            const theatresData = await theatreAPI.getTheatres();

            const screenTheatreMap = {};
            screensData.forEach(screen => {
                screenTheatreMap[screen.screenId] = screen.theatreId;
            });

            const theatreCityMap = {};
            theatresData.forEach(theatre => {
                theatreCityMap[theatre.theatreId] = theatre.city;
            });

            const map = {};
            moviesData.forEach(movie => {
                map[movie.movieId] = new Set();
            });

            showsData.forEach(show => {
                const screenId = show.screenId;
                const theatreId = screenTheatreMap[screenId];
                const city = theatreCityMap[theatreId];

                if (city && map[show.movieId]) {
                    map[show.movieId].add(city);
                }
            });

            setMovieCityMap(map);
            setMovies(moviesData);
            setShows(showsData);
            setError(null);
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...movies];

        if (selectedCity) {
            filtered = filtered.filter(movie => {
                const availableCities = movieCityMap[movie.movieId];
                return availableCities && availableCities.has(selectedCity);
            });
        }

        if (filters.status === 'now-showing') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            filtered = filtered.filter(movie => {
                return shows.some(show => {
                    if (show.movieId !== movie.movieId) return false;
                    const showDate = new Date(show.showDate);
                    showDate.setHours(0, 0, 0, 0);
                    return showDate >= today;
                });
            });
        } else if (filters.status === 'coming-soon') {
            filtered = filtered.filter(movie => new Date(movie.releaseDate) > new Date());
        }

        if (filters.genre) {
            filtered = filtered.filter(movie =>
                movie.genre && movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            return dateB - dateA;
        });

        setFilteredMovies(filtered);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? (type === 'status' ? 'all' : null) : value
        }));
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="loader">
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</h2>
                    <button className="btn btn-primary" onClick={loadData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Bar */}
            <FilterBar activeFilter={filters} onFilterChange={handleFilterChange} />

            {/* Header */}
            <div style={{
                background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                padding: '40px 0 32px'
            }}>
                <div className="container">
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginBottom: '20px',
                        transition: 'var(--transition)'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '12px'
                    }}>
                        <Film size={36} color="var(--primary)" />
                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            All Movies
                        </h1>
                    </div>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1rem'
                    }}>
                        Browse our complete collection of {filteredMovies.length} movies
                    </p>
                </div>
            </div>

            {/* Movies Grid */}
            <div className="container" style={{ padding: '40px 20px 60px' }}>
                {filteredMovies.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: 'var(--text-secondary)'
                    }}>
                        <h2>No movies found {selectedCity && `in ${selectedCity}`}</h2>
                        <p>Try adjusting your filters or selecting a different city</p>
                    </div>
                ) : (
                    <div className="grid grid-5">
                        {filteredMovies.map(movie => {
                            const movieHasShows = shows.some(show => show.movieId === movie.movieId);
                            return (
                                <MovieCard
                                    key={movie.movieId}
                                    movie={movie}
                                    hasShows={movieHasShows}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllMovies;
