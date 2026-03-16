import axios from 'axios';

const API_BASE_URL = 'http://moviemanagementgateway.runasp.net/api';
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';

// Decode JWT token to extract payload
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return true;

        // exp is in seconds, Date.now() is in milliseconds
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/Login/login`, {
            email,
            password
        });

        const { token, user } = response.data;

        // Store token and user info
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return { success: true, token, user };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Login failed. Please check your credentials.'
        };
    }
};

// Register function
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/Register/register`, {
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.'
        };
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// Get stored token
export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);

    // Check if token exists and is not expired
    if (token && !isTokenExpired(token)) {
        return token;
    }

    // Token is expired or doesn't exist, clear storage
    if (token) {
        logout();
    }

    return null;
};

// Get user info from localStorage
export const getUserInfo = () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user info:', error);
            return null;
        }
    }
    return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    return token !== null;
};

// Check if user has admin role
export const isAdmin = () => {
    const user = getUserInfo();
    return user?.role === 'Admin';
};

export default {
    login,
    register,
    logout,
    getToken,
    getUserInfo,
    isAuthenticated,
    isAdmin,
    isTokenExpired
};

