import React, { useState, useEffect, useCallback } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import MovieCollectionChart from '../../components/admin/MovieCollectionChart';
import { adminAnalyticsAPI } from '../../services/adminApi';
import { Calendar } from 'lucide-react';
import '../../styles/admin.css';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('lifetime');
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalTheatres: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
    });

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminAnalyticsAPI.getDashboardStats(dateRange);
            setStats(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const getDateRangeLabel = () => {
        switch (dateRange) {
            case 'today': return 'Today';
            case '7days': return 'Last 7 Days';
            case '30days': return 'Last 30 Days';
            case 'lifetime': return 'All Time';
            default: return 'All Time';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Welcome back! Here's an overview of your movie booking system.
                    </p>
                </div>

                {/* Date Range Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={20} color="var(--text-secondary)" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="form-control"
                        style={{
                            minWidth: '180px',
                            padding: '10px 14px',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="lifetime">All Time</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <StatsCard
                    title="Total Movies"
                    value={stats.totalMovies}
                    icon="🎬"
                    color="primary"
                    subtitle="Active in system"
                />
                <StatsCard
                    title="Total Theatres"
                    value={stats.totalTheatres}
                    icon="🏢"
                    color="success"
                    subtitle="Registered venues"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon="🎫"
                    color="warning"
                    subtitle={getDateRangeLabel()}
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon="💰"
                    color="info"
                    subtitle={getDateRangeLabel()}
                />
            </div>

            {/* Movie Collection Chart */}
            <div style={{ marginTop: '32px' }}>
                <MovieCollectionChart />
            </div>

            {/* Recent Bookings */}
            <div className="data-table-container" style={{ marginTop: '32px' }}>
                <div className="table-header">
                    <h2 className="table-title">Recent Bookings</h2>
                </div>

                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User ID</th>
                                    <th>Show ID</th>
                                    <th>Seats</th>
                                    <th>Total Price</th>
                                    <th>Booking Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td style={{ fontWeight: 600 }}>#{booking.bookingId}</td>
                                        <td>{booking.userId}</td>
                                        <td>{booking.showId}</td>
                                        <td>{booking.seatCount || 'N/A'}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                                            {formatCurrency(booking.totalAmount || 0)}
                                        </td>
                                        <td>{formatDate(booking.created)}</td>
                                        <td>
                                            <span
                                                className={`badge ${booking.paymentStatus === 'Paid' || booking.paymentStatus === 'Completed'
                                                    ? 'badge-success'
                                                    : 'badge-primary'
                                                    }`}
                                            >
                                                {booking.paymentStatus || booking.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="empty-state-title">No Recent Bookings</h3>
                        <p className="empty-state-description">
                            No booking data available yet.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>
                        🎥 Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <a href="/admin/movies" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            Add New Movie
                        </a>
                        <a href="/admin/shows" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            Schedule Show
                        </a>
                        <a href="/admin/bookings" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            View All Bookings
                        </a>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>
                        📊 System Status
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Database
                                </span>
                                <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
                                    Connected
                                </span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    API Status
                                </span>
                                <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
                                    Online
                                </span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
