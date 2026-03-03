import React, { useState, useEffect } from 'react';
import { adminBookingAPI, adminShowAPI, adminMovieAPI } from '../../services/adminApi';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bookingsData, showsData, moviesData] = await Promise.all([
                adminBookingAPI.getAllBookings(),
                adminShowAPI.getShows(),
                adminMovieAPI.getMovies(),
            ]);
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            setShows(Array.isArray(showsData) ? showsData : []);
            setMovies(Array.isArray(moviesData) ? moviesData : []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            setBookings([]);
            setShows([]);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const getMovieTitle = (showId) => {
        const show = shows.find(s => s.showId === showId);
        if (!show) return 'Unknown Movie';

        const movie = movies.find(m => m.movieId === show.movieId);
        return movie ? movie.title : 'Unknown Movie';
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await adminBookingAPI.updateBookingStatus(bookingId, newStatus);
            await loadData();
            toast.success('Booking status updated successfully!');
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking status.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await adminBookingAPI.cancelBooking(bookingId);
            await loadData();
            toast.success('Booking cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Failed to cancel booking.');
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
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredBookings = bookings
        .filter(booking => {
            const matchesSearch =
                booking.bookingId?.toString().includes(searchTerm) ||
                booking.userId?.toString().includes(searchTerm) ||
                getMovieTitle(booking.showId).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' ||
                booking.paymentStatus?.toLowerCase() === filterStatus.toLowerCase() ||
                booking.status?.toLowerCase() === filterStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.created) - new Date(a.created));

    const getStatusBadgeClass = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'paid' || statusLower === 'completed') return 'badge-success';
        if (statusLower === 'Cancelled') return 'badge-error';
        return 'badge-primary';
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
                    Bookings Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and manage all bookings
                </p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Bookings ({filteredBookings.length})</h2>
                    <div className="table-actions">
                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {filteredBookings.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User ID</th>
                                    <th>Movie</th>
                                    <th>Show ID</th>
                                    <th>Seats</th>
                                    <th>Total Price</th>
                                    <th>Booking Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td style={{ fontWeight: 600 }}>#{booking.bookingId}</td>
                                        <td>{booking.userId}</td>
                                        <td style={{ fontWeight: 600 }}>{getMovieTitle(booking.showId)}</td>
                                        <td>#{booking.showId}</td>
                                        <td>{booking.seatCount || 'N/A'}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                                            {formatCurrency(booking.totalAmount || 0)}
                                        </td>
                                        <td>{formatDate(booking.created)}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(booking.paymentStatus || booking.status)}`}>
                                                {booking.paymentStatus || booking.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions-cell">
                                                {(booking.paymentStatus !== 'Completed' && booking.status !== 'Completed') && (
                                                    <button
                                                        className="action-btn view"
                                                        onClick={() => handleUpdateStatus(booking.bookingId, 'Completed')}
                                                        title="Mark as Completed"
                                                    >
                                                        ✓
                                                    </button>
                                                )}
                                                {booking.status !== 'Cancelled' && (
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleCancelBooking(booking.bookingId)}
                                                        title="Cancel Booking"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎫</div>
                        <h3 className="empty-state-title">No Bookings Found</h3>
                        <p className="empty-state-description">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No bookings have been made yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {bookings.length > 0 && (
                <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {bookings.length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
                            Total Bookings
                        </div>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                            {bookings.filter(b => b.paymentStatus === 'Paid' || b.paymentStatus === 'Completed').length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
                            Paid Bookings
                        </div>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>
                            {bookings.filter(b => b.paymentStatus === 'Cancelled' || b.status === 'Cancelled').length}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
                            Cancelled Bookings
                        </div>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                            {formatCurrency(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0))}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
                            Total Revenue
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
