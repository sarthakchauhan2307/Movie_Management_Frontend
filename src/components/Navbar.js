import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, MapPin, User, Ticket, TrendingUp, Menu, X } from 'lucide-react';

import { useCity } from '../context/CityContext';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const { cities, selectedCity, changeCity } = useCity();
    const { user, isAdmin, logout, loading } = useAuth();

    // Don't render navbar while loading or if not authenticated
    if (loading || !user) {
        return null;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
            setMenuOpen(false);
        }
    };

    const closeMobileMenu = () => setMenuOpen(false);

    return (
        <>
            <nav style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: '16px 0'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px'
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textDecoration: 'none',
                        flexShrink: 0
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <Film size={24} color="white" />
                        </div>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px'
                        }}>
                            CineBook
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="navbar-search-desktop">
                        <Search style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} size={20} />
                        <input
                            type="text"
                            placeholder="Search for Movies, Events, Plays, Sports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 48px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </form>

                    {/* Right Side Actions - Desktop */}
                    <div className="navbar-desktop-items">
                        {/* Location */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            position: 'relative',
                            minWidth: '120px'
                        }}>
                            <MapPin size={18} style={{ position: 'absolute', left: 0, pointerEvents: 'none' }} />
                            <select
                                value={selectedCity}
                                onChange={(e) => changeCity(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    paddingLeft: '24px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    width: '100%',
                                    fontWeight: 500
                                }}
                            >
                                <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* My Bookings */}
                        <Link to="/my-bookings" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'var(--transition)'
                        }}>
                            <Ticket size={18} />
                            <span>My Bookings</span>
                        </Link>

                        {/* Collections */}
                        <Link to="/collections" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'var(--transition)'
                        }}>
                            <TrendingUp size={18} />
                            <span>Collections</span>
                        </Link>

                        {/* Admin Link (only for admins) */}
                        {isAdmin && (
                            <Link to="/admin" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                transition: 'var(--transition)'
                            }}>
                                Admin Panel
                            </Link>
                        )}

                        {/* User Info & Logout */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 16px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <User size={18} color="var(--primary)" />
                            <Link
                                to="/profile"
                                style={{
                                    fontSize: '0.95rem',
                                    color: 'var(--text-primary)',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                {user?.userName || 'User'}
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                style={{
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
                {/* Mobile Menu Header */}
                <div className="navbar-mobile-header">
                    <Link to="/" onClick={closeMobileMenu} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex'
                        }}>
                            <Film size={20} color="white" />
                        </div>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            CineBook
                        </span>
                    </Link>
                    <button
                        className="navbar-mobile-toggle"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                        style={{ display: 'flex' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mobile Menu Body */}
                <div className="navbar-mobile-body">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="navbar-mobile-search">
                        <Search style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} size={20} />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </form>

                    {/* Mobile City Selector */}
                    <div className="navbar-mobile-link" style={{ position: 'relative' }}>
                        <MapPin size={20} />
                        <select
                            value={selectedCity}
                            onChange={(e) => changeCity(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                outline: 'none',
                                flex: 1,
                                fontWeight: 500
                            }}
                        >
                            <option value="" style={{ background: 'var(--bg-card)' }}>All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city} style={{ background: 'var(--bg-card)' }}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mobile Nav Links */}
                    <Link to="/" className="navbar-mobile-link" onClick={closeMobileMenu}>
                        <Film size={20} />
                        Home
                    </Link>

                    <Link to="/my-bookings" className="navbar-mobile-link" onClick={closeMobileMenu}>
                        <Ticket size={20} />
                        My Bookings
                    </Link>

                    <Link to="/collections" className="navbar-mobile-link" onClick={closeMobileMenu}>
                        <TrendingUp size={20} />
                        Collections
                    </Link>

                    <Link to="/profile" className="navbar-mobile-link" onClick={closeMobileMenu}>
                        <User size={20} />
                        My Profile
                    </Link>

                    {isAdmin && (
                        <Link to="/admin" className="navbar-mobile-link admin-link" onClick={closeMobileMenu}>
                            Admin Panel
                        </Link>
                    )}

                    {/* User Info */}
                    <div className="navbar-mobile-user">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={20} color="var(--primary)" />
                            <span style={{ fontWeight: 600 }}>{user?.userName || 'User'}</span>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                                closeMobileMenu();
                            }}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--error)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--error)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
