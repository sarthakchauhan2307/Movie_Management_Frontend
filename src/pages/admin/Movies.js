import React, { useState, useEffect } from 'react';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import AddShowModal from '../../components/admin/AddShowModal';
import { adminMovieAPI, adminScreenAPI, adminTheatreAPI } from '../../services/adminApi';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddShowPrompt, setShowAddShowPrompt] = useState(false);
    const [showAddShowModal, setShowAddShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [newlyCreatedMovie, setNewlyCreatedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        language: '',
        duration: '',
        rating: '',
        posterUrl: '',
        releaseDate: '',
        actor: '',
        actress: '',
        director: '',
        trailerUrl: '',
        imageFile: null
    });
    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadMovies();
        loadScreensAndTheatres();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await adminMovieAPI.getMovies();
            setMovies(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading movies:', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const loadScreensAndTheatres = async () => {
        try {
            const [screensData, theatresData] = await Promise.all([
                adminScreenAPI.getScreens(),
                adminTheatreAPI.getTheatres(),
            ]);
            setScreens(Array.isArray(screensData) ? screensData : []);
            setTheatres(Array.isArray(theatresData) ? theatresData : []);
        } catch (error) {
            console.error('Error loading screens and theatres:', error);
            setScreens([]);
            setTheatres([]);
        }
    };

    const handleAddMovie = () => {
        setSelectedMovie(null);
        setFormData({
            title: '',
            description: '',
            genre: '',
            language: '',
            duration: '',
            rating: '',
            posterUrl: '',
            releaseDate: '',
            actor: '',
            actress: '',
            director: '',
            trailerUrl: '',
            imageFile: null
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditMovie = (movie) => {
        setSelectedMovie(movie);
        setFormData({
            title: movie.title || '',
            description: movie.description || '',
            genre: movie.genre || '',
            language: movie.language || '',
            duration: movie.durationMinutes || '',
            // rating: movie.rating || '',
            posterUrl: movie.posterUrl || '',
            releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
            actor: movie.actor || '',
            actress: movie.actress || '',
            director: movie.director || '',
            trailerUrl: movie.trailerUrl || '',
            imageFile: movie.posterUrl || ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (movie) => {
        setSelectedMovie(movie);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminMovieAPI.deleteMovie(selectedMovie.movieId);
            await loadMovies();
            toast.success('Movie deleted successfully!');
        } catch (error) {
            console.error('Error deleting movie:', error);
            toast.error('Failed to delete movie. Please try again.');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.genre.trim()) errors.genre = 'Genre is required';
        if (!formData.language.trim()) errors.language = 'Language is required';
        if (!formData.duration) errors.duration = 'Duration is required';
        // if (!formData.rating) errors.rating = 'Rating is required';
        if (!formData.director.trim()) errors.director = 'Director is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const data = new FormData();
            data.append('Title', formData.title);
            data.append('Description', formData.description);
            data.append('Genre', formData.genre);
            data.append('Language', formData.language);
            data.append('DurationMinutes', formData.duration);
            // data.append('Rating', formData.rating); // If backend expects it
            data.append('ReleaseDate', formData.releaseDate ? new Date(formData.releaseDate).toISOString() : new Date().toISOString());

            data.append('Actor', formData.actor || 'N/A');
            data.append('Actress', formData.actress || 'N/A');
            data.append('Director', formData.director);
            data.append('TrailerUrl', formData.trailerUrl || 'N/A');

            if (formData.imageFile) {
                data.append('File', formData.imageFile);
            }

            if (selectedMovie) {
                await adminMovieAPI.updateMovie(selectedMovie.movieId, data);
                toast.success('Movie updated successfully!');
                setShowModal(false);
                await loadMovies();
            } else {
                const response = await adminMovieAPI.createMovie(data);
                setNewlyCreatedMovie(response);
                setShowModal(false);
                await loadMovies();
                // Show prompt to add show
                setShowAddShowPrompt(true);
            }
        } catch (error) {
            console.error('Error saving movie:', error);
            toast.error('Failed to save movie. Please try again.');
        }
    };

    const handleAddShowConfirm = () => {
        setShowAddShowPrompt(false);
        setShowAddShowModal(true);
    };

    const handleAddShowDecline = () => {
        setShowAddShowPrompt(false);
        setNewlyCreatedMovie(null);
        toast.success('Movie added successfully!');
    };

    const handleShowCreatedSuccess = () => {
        toast.success('Show added successfully!');
        setNewlyCreatedMovie(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageFile: file // Store the raw file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    posterUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.language?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Movies Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage all movies in the system
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleAddMovie}>
                    + Add Movie
                </button>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Movies ({filteredMovies.length})</h2>
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

                {filteredMovies.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Genre</th>
                                    <th>Language</th>
                                    <th>Duration</th>
                                    {/* <th>Rating</th> */}
                                    <th>Release Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.movieId}>
                                        <td style={{ fontWeight: 600 }}>#{movie.movieId}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {/* {movie.posterUrl && (
                                                    <img
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                )} */}
                                                {movie.title}
                                            </div>
                                        </td>
                                        <td>{movie.genre}</td>
                                        <td>{movie.language}</td>
                                        <td>{movie.durationMinutes} min</td>
                                        {/* <td>
                                            <span style={{ color: 'var(--warning)' }}>
                                                ⭐ {movie.rating}
                                            </span>
                                        </td> */}
                                        <td>
                                            {movie.releaseDate
                                                ? new Date(movie.releaseDate).toLocaleDateString('en-IN')
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEditMovie(movie)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteClick(movie)}
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
                        <div className="empty-state-icon">🎬</div>
                        <h3 className="empty-state-title">No Movies Found</h3>
                        <p className="empty-state-description">
                            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first movie.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn btn-primary" onClick={handleAddMovie}>
                                + Add Movie
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Movie Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedMovie ? 'Edit Movie' : 'Add New Movie'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {selectedMovie ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label required">Title</label>
                        <input
                            type="text"
                            name="title"
                            className={`form-control ${formErrors.title ? 'error' : ''}`}
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter movie title"
                        />
                        {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Description</label>
                        <textarea
                            name="description"
                            className={`form-control ${formErrors.description ? 'error' : ''}`}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter movie description"
                            rows="4"
                        />
                        {formErrors.description && <span className="form-error">{formErrors.description}</span>}
                    </div>

                    <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label required">Genre</label>
                            <input
                                type="text"
                                name="genre"
                                className={`form-control ${formErrors.genre ? 'error' : ''}`}
                                value={formData.genre}
                                onChange={handleInputChange}
                                placeholder="e.g., Action, Drama"
                            />
                            {formErrors.genre && <span className="form-error">{formErrors.genre}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Language</label>
                            <input
                                type="text"
                                name="language"
                                className={`form-control ${formErrors.language ? 'error' : ''}`}
                                value={formData.language}
                                onChange={handleInputChange}
                                placeholder="e.g., English, Hindi"
                            />
                            {formErrors.language && <span className="form-error">{formErrors.language}</span>}
                        </div>
                    </div>

                    <div className="grid grid-3" style={{ gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label required">Director</label>
                            <input
                                type="text"
                                name="director"
                                className={`form-control ${formErrors.director ? 'error' : ''}`}
                                value={formData.director}
                                onChange={handleInputChange}
                                placeholder="Director Name"
                            />
                            {formErrors.director && <span className="form-error">{formErrors.director}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Actor</label>
                            <input
                                type="text"
                                name="actor"
                                className="form-control"
                                value={formData.actor}
                                onChange={handleInputChange}
                                placeholder="Main Actor"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Actress</label>
                            <input
                                type="text"
                                name="actress"
                                className="form-control"
                                value={formData.actress}
                                onChange={handleInputChange}
                                placeholder="Main Actress"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trailer URL</label>
                        <input
                            type="text"
                            name="trailerUrl"
                            className="form-control"
                            value={formData.trailerUrl}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/..."
                        />
                    </div>

                    <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label required">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                className={`form-control ${formErrors.duration ? 'error' : ''}`}
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="e.g., 120"
                                min="1"
                            />
                            {formErrors.duration && <span className="form-error">{formErrors.duration}</span>}
                        </div>

                        {/* <div className="form-group">
                            <label className="form-label required">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                className={`form-control ${formErrors.rating ? 'error' : ''}`}
                                value={formData.rating}
                                onChange={handleInputChange}
                                placeholder="e.g., 4.5"
                                min="0"
                                max="10"
                                step="0.1"
                            />
                            {formErrors.rating && <span className="form-error">{formErrors.rating}</span>}
                        </div> */}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Movie Poster</label>

                        <input
                            type="file"
                            name="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {formData.posterUrl && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={formData.posterUrl}
                                    alt="Poster Preview"
                                    style={{ maxWidth: '100px', maxHeight: '150px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}

                        <span className="form-help">Upload movie poster image (jpg, png)</span>
                    </div>


                    <div className="form-group">
                        <label className="form-label">Release Date</label>
                        <input
                            type="date"
                            name="releaseDate"
                            className="form-control"
                            value={formData.releaseDate}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Movie"
                message={`Are you sure you want to delete "${selectedMovie?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Add Show Prompt */}
            <ConfirmDialog
                isOpen={showAddShowPrompt}
                onClose={handleAddShowDecline}
                onConfirm={handleAddShowConfirm}
                title="Movie Added Successfully! 🎉"
                message={`Would you like to add a show for "${newlyCreatedMovie?.title}" now?`}
                confirmText="Yes, Add Show"
                cancelText="No, Maybe Later"
                type="success"
            />

            {/* Add Show Modal */}
            <AddShowModal
                isOpen={showAddShowModal}
                onClose={() => {
                    setShowAddShowModal(false);
                    setNewlyCreatedMovie(null);
                    toast.success('Movie added successfully!');
                }}
                onSuccess={handleShowCreatedSuccess}
                preSelectedMovieId={newlyCreatedMovie?.movieId}
                movies={movies}
                screens={screens}
                theatres={theatres}
            />
        </div>
    );
};

export default Movies;
