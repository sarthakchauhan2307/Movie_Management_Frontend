import React, { useState, useEffect } from 'react';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { adminScreenAPI, adminTheatreAPI } from '../../services/adminApi';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Screens = () => {
    const [screens, setScreens] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        theatreId: '',
        screenName: '',
        screenType: '2D',
        seatCapacity: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [screensData, theatresData] = await Promise.all([
                adminScreenAPI.getScreens(),
                adminTheatreAPI.getTheatres(),
            ]);
            setScreens(Array.isArray(screensData) ? screensData : []);
            setTheatres(Array.isArray(theatresData) ? theatresData : []);
        } catch (error) {
            console.error('Error loading data:', error);
            setScreens([]);
            setTheatres([]);
        } finally {
            setLoading(false);
        }
    };

    const getTheatreName = (theatreId) => {
        const theatre = theatres.find(t => t.theatreId === theatreId);
        return theatre ? theatre.theatreName : 'Unknown Theatre';
    };

    const handleAddScreen = () => {
        setSelectedScreen(null);
        setFormData({
            theatreId: '',
            screenName: '',
            screenType: '2D',
            seatCapacity: '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditScreen = (screen) => {
        setSelectedScreen(screen);
        setFormData({
            theatreId: screen.theatreId || '',
            screenName: screen.screenName || '',
            screenType: screen.screenType || '2D',
            seatCapacity: screen.seatCapacity || '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (screen) => {
        setSelectedScreen(screen);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminScreenAPI.deleteScreen(selectedScreen.screenId);
            await loadData();
            toast.success('Screen deleted successfully!');
        } catch (error) {
            console.error('Error deleting screen:', error);
            toast.error('Failed to delete screen. Please try again.');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.theatreId) errors.theatreId = 'Theatre is required';
        if (!formData.screenName.trim()) errors.screenName = 'Screen name is required';
        if (!formData.seatCapacity) errors.seatCapacity = 'Seat capacity is required';
        else if (formData.seatCapacity < 1) errors.seatCapacity = 'Seat capacity must be at least 1';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const screenData = {
                ...formData,
                theatreId: parseInt(formData.theatreId),
                seatCapacity: parseInt(formData.seatCapacity),
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            };

            if (selectedScreen) {
                await adminScreenAPI.updateScreen(selectedScreen.screenId, screenData);
                toast.success('Screen updated successfully!');
            } else {
                await adminScreenAPI.createScreen(screenData);
                toast.success('Screen added successfully!');
            }

            setShowModal(false);
            await loadData();
        } catch (error) {
            console.error('Error saving screen:', error);
            toast.error('Failed to save screen. Please try again.');
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

    const filteredScreens = screens.filter(screen =>
        screen.screenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.screenType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTheatreName(screen.theatreId).toLowerCase().includes(searchTerm.toLowerCase())
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
                        Screens Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage all screens across all theatres
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleAddScreen}>
                    + Add Screen
                </button>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Screens ({filteredScreens.length})</h2>
                    <div className="table-actions">
                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search screens..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredScreens.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Screen Name</th>
                                    <th>Theatre</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScreens.map((screen) => (
                                    <tr key={screen.screenId}>
                                        <td style={{ fontWeight: 600 }}>#{screen.screenId}</td>
                                        <td style={{ fontWeight: 600 }}>{screen.screenName}</td>
                                        <td>{getTheatreName(screen.theatreId)}</td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {screen.screenType}
                                            </span>
                                        </td>
                                        <td>{screen.seatCapacity} seats</td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEditScreen(screen)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteClick(screen)}
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
                        <div className="empty-state-icon">🖥️</div>
                        <h3 className="empty-state-title">No Screens Found</h3>
                        <p className="empty-state-description">
                            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first screen.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn btn-primary" onClick={handleAddScreen}>
                                + Add Screen
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Screen Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedScreen ? 'Edit Screen' : 'Add New Screen'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {selectedScreen ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label required">Theatre</label>
                        <select
                            name="theatreId"
                            className={`form-control ${formErrors.theatreId ? 'error' : ''}`}
                            value={formData.theatreId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a theatre</option>
                            {theatres.map((theatre) => (
                                <option key={theatre.theatreId} value={theatre.theatreId}>
                                    {theatre.theatreName} - {theatre.location}
                                </option>
                            ))}
                        </select>
                        {formErrors.theatreId && <span className="form-error">{formErrors.theatreId}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Screen Name</label>
                        <input
                            type="text"
                            name="screenName"
                            className={`form-control ${formErrors.screenName ? 'error' : ''}`}
                            value={formData.screenName}
                            onChange={handleInputChange}
                            placeholder="e.g., Screen 1, Audi 1"
                        />
                        {formErrors.screenName && <span className="form-error">{formErrors.screenName}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Screen Type</label>
                        <select
                            name="screenType"
                            className="form-control"
                            value={formData.screenType}
                            onChange={handleInputChange}
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Seat Capacity</label>
                        <input
                            type="number"
                            name="seatCapacity"
                            className={`form-control ${formErrors.seatCapacity ? 'error' : ''}`}
                            value={formData.seatCapacity}
                            onChange={handleInputChange}
                            placeholder="e.g., 200"
                            min="1"
                        />
                        {formErrors.seatCapacity && <span className="form-error">{formErrors.seatCapacity}</span>}
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Screen"
                message={`Are you sure you want to delete "${selectedScreen?.screenName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Screens;
