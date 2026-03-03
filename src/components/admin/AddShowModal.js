import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { adminShowAPI } from '../../services/adminApi';
import '../../styles/admin.css';

const AddShowModal = ({
    isOpen,
    onClose,
    onSuccess,
    preSelectedMovieId = null,
    movies = [],
    screens = [],
    theatres = []
}) => {
    const [formData, setFormData] = useState({
        movieId: '',
        screenId: '',
        showTime: '',
        showDate: '',
        price: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill movie when modal opens
    useEffect(() => {
        if (isOpen && preSelectedMovieId) {
            setFormData(prev => ({
                ...prev,
                movieId: preSelectedMovieId.toString()
            }));
        }
    }, [isOpen, preSelectedMovieId]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                movieId: preSelectedMovieId ? preSelectedMovieId.toString() : '',
                screenId: '',
                showTime: '',
                showDate: '',
                price: '',
            });
            setFormErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, preSelectedMovieId]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const showData = {
                movieId: parseInt(formData.movieId),
                screenId: parseInt(formData.screenId),
                showDate: new Date(formData.showDate).toISOString(),
                showTime: formData.showTime + (formData.showTime.length === 5 ? ":00" : ""),
                price: parseFloat(formData.price),
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };

            await adminShowAPI.createShow(showData);

            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error) {
            console.error('Error creating show:', error);
            alert('Failed to create show. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMovieTitle = (movieId) => {
        const movie = movies.find(m => m.movieId === parseInt(movieId));
        return movie ? movie.title : '';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Show"
            footer={
                <>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Show'}
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
                        disabled={preSelectedMovieId !== null}
                    >
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                            <option key={movie.movieId} value={movie.movieId}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                    {formErrors.movieId && <span className="form-error">{formErrors.movieId}</span>}
                    {preSelectedMovieId && (
                        <span className="form-help" style={{ color: 'var(--success)', marginTop: '4px', display: 'block' }}>
                            ✓ Movie "{getMovieTitle(formData.movieId)}" selected
                        </span>
                    )}
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
    );
};

export default AddShowModal;
