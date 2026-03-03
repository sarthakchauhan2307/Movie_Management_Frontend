import React, { useState, useEffect } from 'react';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { adminTheatreAPI } from '../../services/adminApi';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Theatres = () => {
    const [theatres, setTheatres] = useState([]);
    const [screenCounts, setScreenCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        theatreName: '',
        address: '',
        city: '',
        phoneNumber: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadTheatres();
    }, []);

    const loadTheatres = async () => {
        try {
            setLoading(true);
            const [theatresData, screenCountData] = await Promise.all([
                adminTheatreAPI.getTheatres(),
                adminTheatreAPI.getTheatreWiseScreenCount().catch(() => [])
            ]);

            setTheatres(Array.isArray(theatresData) ? theatresData : []);

            // Create a map of theatre name to screen count
            const countMap = {};
            if (Array.isArray(screenCountData)) {
                screenCountData.forEach(item => {
                    countMap[item.theatreName] = item.screenCount;
                });
            }
            setScreenCounts(countMap);
        } catch (error) {
            console.error('Error loading theatres:', error);
            setTheatres([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTheatre = () => {
        setSelectedTheatre(null);
        setFormData({
            theatreName: '',
            address: '',
            city: '',
            phoneNumber: '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditTheatre = (theatre) => {
        setSelectedTheatre(theatre);
        setFormData({
            theatreName: theatre.theatreName || '',
            address: theatre.address || '',
            city: theatre.city || '',
            phoneNumber: theatre.phoneNumber || '',
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (theatre) => {
        setSelectedTheatre(theatre);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminTheatreAPI.deleteTheatre(selectedTheatre.theatreId);
            await loadTheatres();
            toast.success('Theatre deleted successfully!');
        } catch (error) {
            console.error('Error deleting theatre:', error);
            toast.error('Failed to delete theatre. Please try again.');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.theatreName.trim()) errors.theatreName = 'Name is required';
        if (!formData.city.trim()) errors.city = 'City is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const theatreData = {
                ...formData,
                // Preserve created date if editing, else new date
                created: selectedTheatre?.created || new Date().toISOString(),
                modified: new Date().toISOString(),
            };

            if (selectedTheatre) {
                await adminTheatreAPI.updateTheatre(selectedTheatre.theatreId, theatreData);
                toast.success('Theatre updated successfully!');
            } else {
                await adminTheatreAPI.createTheatre(theatreData);
                toast.success('Theatre added successfully!');
            }

            setShowModal(false);
            await loadTheatres();
        } catch (error) {
            console.error('Error saving theatre:', error);
            toast.error('Failed to save theatre. Please try again.');
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

    const filteredTheatres = theatres.filter(theatre =>
        theatre.theatreName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theatre.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        Theatres Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage all theatres in the system
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleAddTheatre}>
                    + Add Theatre
                </button>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Theatres ({filteredTheatres.length})</h2>
                    <div className="table-actions">
                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search theatres..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredTheatres.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>City</th>
                                    <th>Screens</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTheatres.map((theatre) => (
                                    <tr key={theatre.theatreId}>
                                        <td style={{ fontWeight: 600 }}>#{theatre.theatreId}</td>
                                        <td style={{ fontWeight: 600 }}>{theatre.theatreName}</td>
                                        <td>{theatre.address}</td>
                                        <td>{theatre.city}</td>
                                        <td>
                                            <span className="table-actions-cell">
                                                {screenCounts[theatre.theatreName] || 0}
                                            </span>
                                        </td>
                                        <td>{theatre.phoneNumber || 'N/A'}</td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEditTheatre(theatre)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteClick(theatre)}
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
                        <div className="empty-state-icon">🏢</div>
                        <h3 className="empty-state-title">No Theatres Found</h3>
                        <p className="empty-state-description">
                            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first theatre.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn btn-primary" onClick={handleAddTheatre}>
                                + Add Theatre
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Theatre Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedTheatre ? 'Edit Theatre' : 'Add New Theatre'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {selectedTheatre ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label required">Theatre Name</label>
                        <input
                            type="text"
                            name="theatreName"
                            className={`form-control ${formErrors.theatreName ? 'error' : ''}`}
                            value={formData.theatreName}
                            onChange={handleInputChange}
                            placeholder="Enter theatre name"
                        />
                        {formErrors.theatreName && <span className="form-error">{formErrors.theatreName}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <textarea
                            name="address"
                            className="form-control"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter full address"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label required">City</label>
                        <input
                            type="text"
                            name="city"
                            className={`form-control ${formErrors.city ? 'error' : ''}`}
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                        />
                        {formErrors.city && <span className="form-error">{formErrors.city}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="form-control"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter contact number"
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Theatre"
                message={`Are you sure you want to delete "${selectedTheatre?.theatreName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

        </div>
    );
};

export default Theatres;
