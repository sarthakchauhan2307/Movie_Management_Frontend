import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, MapPin, User, Ticket, TrendingUp } from 'lucide-react';

import { useCity } from '../context/CityContext';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');
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
        }
    };

    return (
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

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{
                    flex: 1,
                    maxWidth: '500px',
                    position: 'relative'
                }}>
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

                {/* Right Side Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexShrink: 0
                }}>
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
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-primary)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
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
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-primary)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
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
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-primary)';
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--error)';
                                e.currentTarget.style.borderColor = 'var(--error)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
