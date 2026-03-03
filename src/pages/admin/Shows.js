import React, { useState, useEffect } from 'react';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { adminShowAPI, adminMovieAPI, adminScreenAPI, adminTheatreAPI } from '../../services/adminApi';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Shows = () => {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [formData, setFormData] = useState({
        movieId: '',
        screenId: '',
        showTime: '',
        showDate: '',
        price: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [showsData, moviesData, screensData, theatresData] = await Promise.all([
                adminShowAPI.getShows(),
                adminMovieAPI.getMovies(),
                adminScreenAPI.getScreens(),
                adminTheatreAPI.getTheatres(),
            ]);
            setShows(Array.isArray(showsData) ? showsData : []);
            setMovies(Array.isArray(moviesData) ? moviesData : []);
            setScreens(Array.isArray(screensData) ? screensData : []);
            setTheatres(Array.isArray(theatresData) ? theatresData : []);
        } catch (error) {
            console.error('Error loading data:', error);
            setShows([]);
            setMovies([]);
            setScreens([]);
            setTheatres([]);
        } finally {
            setLoading(false);
        }
    };

    const getMovieTitle = (movieId) => {
        const movie = movies.find(m => m.movieId === movieId);
        return movie ? movie.title : 'Unknown Movie';
    };

    const getScreenName = (screenId) => {
        const screen = screens.find(s => s.screenId === screenId);
        if (!screen) return 'Unknown Screen';

        const theatre = theatres.find(t => t.theatreId === screen.theatreId);
        return theatre ? `${screen.screenName} - ${theatre.theatreName}` : screen.screenName;
    };

    const handleAddShow = () => {
        setSelectedShow(null);
        setFormData({
            movieId: '',
            screenId: '',
            showTime: '',
            showDate: '',
            price: '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditShow = (show) => {
        setSelectedShow(show);

        // Parse showDate and showTime
        let dateValue = '';
        let timeValue = '';

        if (show.showDate) {
            dateValue = show.showDate.split('T')[0];
        }

        if (show.showTime) {
            // Check if showTime is full ISO or just time string
            if (show.showTime.includes('T')) {
                timeValue = show.showTime.split('T')[1].substring(0, 5);
            } else {
                timeValue = show.showTime.substring(0, 5);
            }
        }

        setFormData({
            movieId: show.movieId || '',
            screenId: show.screenId || '',
            showTime: timeValue,
            showDate: dateValue,
            price: show.price || '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (show) => {
        setSelectedShow(show);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminShowAPI.deleteShow(selectedShow.showId);
            await loadData();
            toast.success('Show deleted successfully!');
        } catch (error) {
            console.error('Error deleting show:', error);
            toast.error('Failed to delete show. Please try again.');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.movieId) errors.movieId = 'Movie is required';
        if (!formData.screenId) errors.screenId = 'Screen is required';
        if (!formData.showTime) errors.showTime = 'Show time is required';
        if (!formData.showDate) errors.showDate = 'Show date is required';
        if (!formData.price) errors.price = 'Price is required';
        else if (formData.price < 0) errors.price = 'Price must be positive';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const showData = {
                movieId: parseInt(formData.movieId),
                screenId: parseInt(formData.screenId),
                showDate: new Date(formData.showDate).toISOString(), // Backend wants DateTime
                showTime: formData.showTime + (formData.showTime.length === 5 ? ":00" : ""), // Ensure HH:mm:ss format
                price: parseFloat(formData.price),
                created: selectedShow?.created || new Date().toISOString(),
                modified: new Date().toISOString()
            };

            if (selectedShow) {
                await adminShowAPI.updateShow(selectedShow.showId, showData);
                toast.success('Show updated successfully!');
            } else {
                await adminShowAPI.createShow(showData);
                toast.success('Show added successfully!');
            }

            setShowModal(false);
            await loadData();
        } catch (error) {
            console.error('Error saving show:', error);
            toast.error('Failed to save show. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Date filtering logic
    const getFilteredByDate = (shows) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        switch (dateFilter) {
            case 'today':
                const today = new Date(now);
                return shows.filter(show => {
                    const showDate = new Date(show.showDate);
                    showDate.setHours(0, 0, 0, 0);
                    return showDate.getTime() === today.getTime();
                });

            case 'week':
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return shows.filter(show => {
                    const showDate = new Date(show.showDate);
                    return showDate >= now && showDate < weekEnd;
                });

            case 'month':
                const monthEnd = new Date(now);
                monthEnd.setDate(monthEnd.getDate() + 30);
                return shows.filter(show => {
                    const showDate = new Date(show.showDate);
                    return showDate >= now && showDate < monthEnd;
                });

            case 'all':
            default:
                return shows;
        }
    };

    // Apply search and date filters, then sort by date (newest first)
    const filteredShows = getFilteredByDate(shows)
        .filter(show =>
            getMovieTitle(show.movieId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getScreenName(show.screenId).toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Sort by date and time (newest/latest first)
            const dateA = new Date(a.showDate + 'T' + a.showTime);
            const dateB = new Date(b.showDate + 'T' + b.showTime);
            return dateB - dateA; // Descending order (newest first)
        });

    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Format time string if present, else just return date
        const time = timeString ? timeString.substring(0, 5) : '';
        return time ? `${date} ${time}` : date;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
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
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                        Shows Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Schedule and manage all movie shows
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleAddShow}>
                    + Add Show
                </button>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Shows ({filteredShows.length})</h2>
                    <div className="table-actions">
                        {/* Date Filter Chips */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginRight: '16px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                className={`chip ${dateFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setDateFilter('all')}
                                style={{ fontSize: '0.85rem' }}
                            >
                                All
                            </button>
                            <button
                                className={`chip ${dateFilter === 'today' ? 'active' : ''}`}
                                onClick={() => setDateFilter('today')}
                                style={{ fontSize: '0.85rem' }}
                            >
                                Today
                            </button>
                            <button
                                className={`chip ${dateFilter === 'week' ? 'active' : ''}`}
                                onClick={() => setDateFilter('week')}
                                style={{ fontSize: '0.85rem' }}
                            >
                                Next 7 Days
                            </button>
                            <button
                                className={`chip ${dateFilter === 'month' ? 'active' : ''}`}
                                onClick={() => setDateFilter('month')}
                                style={{ fontSize: '0.85rem' }}
                            >
                                Next 30 Days
                            </button>
                        </div>

                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search shows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredShows.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Movie</th>
                                    <th>Screen & Theatre</th>
                                    <th>Show Time</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShows.map((show) => (
                                    <tr key={show.showId}>
                                        <td style={{ fontWeight: 600 }}>#{show.showId}</td>
                                        <td style={{ fontWeight: 600 }}>{getMovieTitle(show.movieId)}</td>
                                        <td>{getScreenName(show.screenId)}</td>
                                        <td>{formatDateTime(show.showDate, show.showTime)}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                                            {formatCurrency(show.price)}
                                        </td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEditShow(show)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteClick(show)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎭</div>
                        <h3 className="empty-state-title">No Shows Found</h3>
                        <p className="empty-state-description">
                            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by scheduling your first show.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn btn-primary" onClick={handleAddShow}>
                                + Add Show
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Show Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedShow ? 'Edit Show' : 'Add New Show'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {selectedShow ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label required">Movie</label>
                        <select
                            name="movieId"
                            className={`form-control ${formErrors.movieId ? 'error' : ''}`}
                            value={formData.movieId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a movie</option>
                            {movies.map((movie) => (
                                <option key={movie.movieId} value={movie.movieId}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                        {formErrors.movieId && <span className="form-error">{formErrors.movieId}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Screen</label>
                        <select
                            name="screenId"
                            className={`form-control ${formErrors.screenId ? 'error' : ''}`}
                            value={formData.screenId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a screen</option>
                            {screens.map((screen) => {
                                const theatre = theatres.find(t => t.theatreId === screen.theatreId);
                                return (
                                    <option key={screen.screenId} value={screen.screenId}>
                                        {screen.screenName} - {theatre ? theatre.theatreName : 'Unknown'} ({screen.screenType})
                                    </option>
                                );
                            })}
                        </select>
                        {formErrors.screenId && <span className="form-error">{formErrors.screenId}</span>}
                    </div>

                    <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label required">Show Date</label>
                            <input
                                type="date"
                                name="showDate"
                                className={`form-control ${formErrors.showDate ? 'error' : ''}`}
                                value={formData.showDate}
                                onChange={handleInputChange}
                            />
                            {formErrors.showDate && <span className="form-error">{formErrors.showDate}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Show Time</label>
                            <input
                                type="time"
                                name="showTime"
                                className={`form-control ${formErrors.showTime ? 'error' : ''}`}
                                value={formData.showTime}
                                onChange={handleInputChange}
                            />
                            {formErrors.showTime && <span className="form-error">{formErrors.showTime}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            className={`form-control ${formErrors.price ? 'error' : ''}`}
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="e.g., 250"
                            min="0"
                            step="0.01"
                        />
                        {formErrors.price && <span className="form-error">{formErrors.price}</span>}
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Show"
                message={`Are you sure you want to delete this show? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Shows;
