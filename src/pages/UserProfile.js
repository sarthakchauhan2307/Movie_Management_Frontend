import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Lock } from 'lucide-react';

const UserProfile = () => {
    const { user, updateUserInfo } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Fetch user data from API when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await userAPI.getUserById(user.userId);
                setUserData(response);
                setFormData({
                    userName: response.userName || '',
                    email: response.email || '',
                    phoneNumber: response.phoneNumber || '',
                    password: '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load profile data. Please try again.');
                // Fallback to cached user data from auth context
                setUserData(user);
                setFormData({
                    userName: user.userName || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    password: '',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user?.userId]);

    const validateForm = () => {
        const errors = {};

        if (!formData.userName.trim()) {
            errors.userName = 'Username is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = 'Phone number must be 10 digits';
        }

        // Password is optional - only validate if user entered something
        if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            // Prepare update data
            const updateData = {
                userId: userData.userId,
                userName: formData.userName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                role: userData.role,
                created: userData.created,
                modified: new Date().toISOString(),
            };

            // Only include password if user wants to change it
            if (formData.password) {
                updateData.password = formData.password;
            } else {
                // Send a placeholder or the existing password hash
                updateData.password = 'unchanged';
            }

            const response = await userAPI.updateUser(userData.userId, updateData);

            // Update local state with new data
            const updatedUserData = {
                ...userData,
                userName: formData.userName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            };
            setUserData(updatedUserData);

            // Update auth context with new user info
            updateUserInfo(updatedUserData);

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            userName: userData?.userName || '',
            email: userData?.email || '',
            phoneNumber: userData?.phoneNumber || '',
            password: '',
        });
        setFormErrors({});
        setError('');
        setSuccess('');
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
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
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <User size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                        My Profile
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage your account information
                    </p>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div style={{
                        padding: '16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--error)',
                        marginBottom: '24px'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '16px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid var(--success)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--success)',
                        marginBottom: '24px'
                    }}>
                        {success}
                    </div>
                )}

                {/* Profile Card */}
                <div className="card profile-card" style={{ padding: '32px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            Profile Information
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Username */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    <User size={16} />
                                    Username
                                </label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            style={{
                                                fontSize: '1rem',
                                                padding: '12px'
                                            }}
                                        />
                                        {formErrors.userName && (
                                            <span className="form-error">{formErrors.userName}</span>
                                        )}
                                    </>
                                ) : (
                                    <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                        {userData?.userName}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    <Mail size={16} />
                                    Email
                                </label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            style={{
                                                fontSize: '1rem',
                                                padding: '12px'
                                            }}
                                        />
                                        {formErrors.email && (
                                            <span className="form-error">{formErrors.email}</span>
                                        )}
                                    </>
                                ) : (
                                    <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                        {userData?.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    <Phone size={16} />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            style={{
                                                fontSize: '1rem',
                                                padding: '12px'
                                            }}
                                        />
                                        {formErrors.phoneNumber && (
                                            <span className="form-error">{formErrors.phoneNumber}</span>
                                        )}
                                    </>
                                ) : (
                                    <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                        {userData?.phoneNumber}
                                    </p>
                                )}
                            </div>

                            {/* Password (only in edit mode) */}
                            {isEditing && (
                                <div>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        marginBottom: '8px'
                                    }}>
                                        <Lock size={16} />
                                        New Password (optional)
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Leave blank to keep current password"
                                        style={{
                                            fontSize: '1rem',
                                            padding: '12px'
                                        }}
                                    />
                                    {formErrors.password && (
                                        <span className="form-error">{formErrors.password}</span>
                                    )}
                                </div>
                            )}

                            {/* Role (read-only) */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    <Shield size={16} />
                                    Role
                                </label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                    <span className={`badge ${userData?.role === 'Admin' ? 'badge-primary' : 'badge-success'}`}>
                                        {userData?.role || 'User'}
                                    </span>
                                </p>
                            </div>

                            {/* Account Creation Date (read-only) */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    <Calendar size={16} />
                                    Member Since
                                </label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                    {formatDate(userData?.created)}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="profile-actions" style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '32px',
                                paddingTop: '24px',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-secondary"
                                    disabled={saving}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
