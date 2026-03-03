import React, { useState, useEffect } from 'react';
import { adminUserAPI } from '../../services/adminApi';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../components/admin/Toast';
import '../../styles/admin.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userBookings, setUserBookings] = useState({});
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'User'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await adminUserAPI.getAllUsers();
            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setFormData({
            userName: '',
            email: '',
            password: '',
            phoneNumber: '',
            role: ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            userName: user.userName || '',
            email: user.email || '',
            password: user.password || '', // Usually password isn't sent back, but kept for update if needed
            phoneNumber: user.phoneNumber || '',
            role: user.role || 'User'
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminUserAPI.deleteUser(selectedUser.userId);
            setShowDeleteDialog(false);
            await loadUsers();
            toast.success('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            setShowDeleteDialog(false);
            toast.error(`Failed to delete user: ${error.response?.data?.message || error.message || 'Please try again.'}`);
        }
    };

    const handleViewDetails = async (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
        try {
            const bookings = await adminUserAPI.getUserBookings(user.userId);
            setUserBookings(prev => ({
                ...prev,
                [user.userId]: Array.isArray(bookings) ? bookings : []
            }));
        } catch (error) {
            console.error('Error loading user bookings:', error);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.userName.trim()) errors.userName = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

        if (!formData.password && !selectedUser) errors.password = 'Password is required';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const userData = {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                created: selectedUser?.created || new Date().toISOString(),
                modified: new Date().toISOString()
            };

            if (selectedUser) {
                // Update
                const updateData = { ...userData, userId: selectedUser.userId };
                await adminUserAPI.updateUser(selectedUser.userId, updateData);
                toast.success('User updated successfully!');
            } else {
                // Create
                await adminUserAPI.createUser(userData);
                toast.success('User created successfully!');
            }

            setShowModal(false);
            loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Failed to save user. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const filteredUsers = users.filter(user =>
        (user.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader"><div className="spinner"></div></div>;

    return (
        <div>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Users Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage system users and admins</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddUser}>+ Add User</button>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2 className="table-title">All Users ({filteredUsers.length})</h2>
                    <div className="table-actions">
                        <div className="table-search">
                            <span className="table-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>#{user.userId}</td>
                                        <td style={{ fontWeight: 600 }}>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td><span className={`badge ${user.role === 'Admin' ? 'badge-primary' : 'badge-secondary'}`}>{user.role}</span></td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button className="action-btn view" onClick={() => handleViewDetails(user)} title="View Details">👁️</button>
                                                <button className="action-btn edit" onClick={() => handleEditUser(user)} title="Edit">✏️</button>
                                                <button className="action-btn delete" onClick={() => handleDeleteClick(user)} title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedUser ? 'Edit User' : 'Add New User'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>{selectedUser ? 'Update' : 'Create'}</button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label required">Name</label>
                        <input type="text" name="userName" className="form-control" value={formData.userName} onChange={handleInputChange} />
                        {formErrors.userName && <span className="form-error">{formErrors.userName}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} />
                        {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Phone Used</label>
                        <input type="text" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleInputChange} />
                        {formErrors.phoneNumber && <span className="form-error">{formErrors.phoneNumber}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Role</label>
                        <select name="role" className="form-control" value={formData.role} onChange={handleInputChange}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Password</label>
                        <input type="text" name="password" className="form-control" value={formData.password} onChange={handleInputChange} placeholder={selectedUser ? "Leave blank to keep current" : ""} />
                        {formErrors.password && <span className="form-error">{formErrors.password}</span>}
                    </div>
                </form>
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message="Are you sure you want to delete this user?"
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* View Details Modal (Simplified) */}
            {showDetailsModal && selectedUser && (
                <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="User Details" footer={<button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>}>
                    <div>
                        <p><strong>ID:</strong> {selectedUser.userId}</p>
                        <p><strong>Name:</strong> {selectedUser.userName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <div className="divider"></div>
                        <h3>Recent Bookings</h3>
                        {userBookings[selectedUser.userId]?.length > 0 ? (
                            <ul>
                                {userBookings[selectedUser.userId].map(b => (
                                    <li key={b.bookingId}>Booking #{b.bookingId} - ₹{b.totalAmount}</li>
                                ))}
                            </ul>
                        ) : <p>No bookings found.</p>}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Users;
