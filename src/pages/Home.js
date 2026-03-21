import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { movieAPI, showAPI, screenAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { Film, ChevronLeft, ChevronRight, Search, Armchair, CalendarCheck, CheckCircle } from 'lucide-react';
import { useCity } from '../context/CityContext';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const { selectedCity } = useCity();
    const [movieCityMap, setMovieCityMap] = useState({});
    const [shows, setShows] = useState([]);

    // Scroll state
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [filters, setFilters] = useState({
        status: 'all',
        genre: null
    });

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...movies];

        if (selectedCity) {
            filtered = filtered.filter(movie => {
                const availableCities = movieCityMap[movie.movieId];
                return availableCities && availableCities.has(selectedCity);
            });
        }

        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
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
    }, [movies, filters, searchParams, selectedCity, movieCityMap, shows]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Update scroll button state
    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [filteredMovies, updateScrollButtons]);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 480;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

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

    const howItWorksSteps = [
        {
            icon: <Search size={28} />,
            title: 'Browse Movies',
            desc: 'Explore our wide collection of movies currently showing and coming soon in your city.'
        },
        {
            icon: <CalendarCheck size={28} />,
            title: 'Select Show',
            desc: 'Pick your preferred date, time, theatre, and screen for the perfect movie experience.'
        },
        {
            icon: <Armchair size={28} />,
            title: 'Choose Seats',
            desc: 'Select your favorite seats from our interactive seat map with real-time availability.'
        },
        {
            icon: <CheckCircle size={28} />,
            title: 'Confirm Booking',
            desc: 'Review your selection, complete payment, and get your e-ticket instantly. Enjoy!'
        }
    ];

    return (
        <div>
            {/* Filter Bar */}
            <FilterBar activeFilter={filters} onFilterChange={handleFilterChange} />

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                padding: '60px 0 40px'
            }}>
                <div className="container">
                    <div className="home-hero-header">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <Film size={40} color="var(--primary)" />
                            <h1
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {filters.status === 'coming-soon'
                                    ? 'Coming Soon'
                                    : filters.status === 'now-showing'
                                        ? 'Now Showing'
                                        : 'All Movies'}
                            </h1>
                        </div>
                        <Link to="/movies" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--primary)',
                            background: 'rgba(220, 38, 38, 0.08)',
                            transition: 'var(--transition)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)';
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            See All <ChevronRight size={18} />
                        </Link>
                    </div>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '600px'
                    }}>
                        Book your favorite movies now! Experience cinema like never before.
                    </p>
                </div>
            </div>

            {/* Movies Horizontal Scroll */}
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
                    <div className="movie-scroll-wrapper">
                        {/* Left Arrow */}
                        <button
                            className="scroll-arrow left"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Scrollable Movie List */}
                        <div className="movie-scroll-container" ref={scrollRef}>
                            {filteredMovies.map(movie => {
                                const movieHasShows = shows.some(show => show.movieId === movie.movieId);
                                return (
                                    <div key={movie.movieId} className="movie-scroll-item">
                                        <MovieCard
                                            movie={movie}
                                            hasShows={movieHasShows}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Arrow */}
                        <button
                            className="scroll-arrow right"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={24} />
                        </button>

                    </div>
                )}
            </div>

            {/* How Book My Show Works */}
            <div className="how-it-works">
                <div className="container">
                    <div className="how-it-works-title">
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            How It Works
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Book your movie tickets in 4 simple steps
                        </p>
                    </div>

                    <div className="how-it-works-grid">
                        {howItWorksSteps.map((step, index) => (
                            <div key={index} className="how-it-works-step">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
