import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getUserInfo, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage on app load
        const restoreSession = () => {
            if (isAuthenticated()) {
                const userInfo = getUserInfo();
                setUser(userInfo);
            }
            setLoading(false);
        };

        restoreSession();
    }, []);

    const login = async (email, password) => {
        const result = await loginService(email, password);

        if (result.success) {
            setUser(result.user);
            return { success: true, user: result.user };
        }

        return { success: false, error: result.error };
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const updateUserInfo = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        login,
        logout,
        updateUserInfo,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
