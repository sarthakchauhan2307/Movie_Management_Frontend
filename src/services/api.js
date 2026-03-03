import axios from 'axios';
import { getToken } from './authService';

// Updated to use API Gateway
const API_BASE_URL = 'https://localhost:7218/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add// Response interceptor - handle 401 unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect if not already on login or register page
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_info');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


// ===== MOVIE SERVICE =====
// Gateway routes /api/movies/{everything}
export const movieAPI = {
    getMovies: async () => {
        try {
            const response = await api.get('/movies/GetMovies');
            return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    },

    getMovieById: async (id) => {
        try {
            const response = await api.get(`/movies/GetMovieById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie:', error);
            throw error;
        }
    },
};

// ===== THEATRE SERVICE =====
// Gateway routes /api/theatre/{everything} -> downstream /api/{everything}
export const theatreAPI = {
    getTheatres: async () => {
        try {
            const response = await api.get('/theatre/Theatre/GetTheatre');
            return response.data;
        } catch (error) {
            console.error('Error fetching theatres:', error);
            throw error;
        }
    },

    getTheatreById: async (id) => {
        try {
            const response = await api.get(`/theatre/Theatre/GetTheatreById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching theatre:', error);
            throw error;
        }
    },
};

// ===== SCREEN SERVICE =====
// Screen service is part of TheatreMaster service
export const screenAPI = {
    getScreens: async () => {
        try {
            const response = await api.get('/theatre/Screen/GetScreens');
            return response.data;
        } catch (error) {
            console.error('Error fetching screens:', error);
            throw error;
        }
    },

    getScreenById: async (id) => {
        try {
            const response = await api.get(`/theatre/Screen/GetScreenById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching screen:', error);
            throw error;
        }
    },
};

// ===== SHOW SERVICE =====
// Show service is part of TheatreMaster service
export const showAPI = {
    getShows: async () => {
        try {
            const response = await api.get('/theatre/Show/GetShows');
            return response.data;
        } catch (error) {
            console.error('Error fetching shows:', error);
            throw error;
        }
    },

    getShowById: async (id) => {
        try {
            const response = await api.get(`/theatre/Show/GetShowById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching show:', error);
            throw error;
        }
    },

    getShowsByMovieId: async (movieId) => {
        try {
            const response = await api.get(`/theatre/Show/GetShowsByMovieId/movie/${movieId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shows for movie:', error);
            throw error;
        }
    },

    getAvailableSeats: async (showId) => {
        try {
            const response = await api.get(`/theatre/Show/GetAvailableSeats/${showId}/available-seats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available seats:', error);
            throw error;
        }
    },
};

// ===== BOOKING SERVICE =====
// Gateway routes /api/booking/{everything}
export const bookingAPI = {
    createBookingWithSeats: async (bookingData) => {
        try {
            // New combined endpoint that creates booking and assigns seats in one call
            const response = await api.post('/booking/CreateBookingWithSeats/create-with-seats', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking with seats:', error);
            throw error;
        }
    },

    // Legacy method - kept for backward compatibility
    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/booking/CreateBooking', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    bulkBookSeats: async (bulkBookingData) => {
        try {
            const response = await api.post('/booking/BulkBookSeats', bulkBookingData);
            return response.data;
        } catch (error) {
            console.error('Error booking seats:', error);
            throw error;
        }
    },

    getUserBookings: async (userId) => {
        try {
            const response = await api.get(`/booking/GetBookingsByUserId/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            throw error;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await api.get(`/booking/GetBookingById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booking:', error);
            throw error;
        }
    },

    getBookedSeats: async (bookingId) => {
        try {
            const response = await api.get(`/booking/GetBookedSeats/${bookingId}/seats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booked seats:', error);
            throw error;
        }
    },

    getBookingsByShow: async (showId) => {
        try {
            const response = await api.get(`/booking/GetBookingsByShow/show/${showId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings for show:', error);
            throw error;
        }
    },

    cancelBooking: async (id) => {
        try {
            const response = await api.put(`/booking/CancelBooking/cancel/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    },

    updateBookingStatus: async (id, paymentStatus) => {
        try {
            const response = await api.put(`/booking/UpdateBookingStatus/status/${id}?PaymentStatus=${paymentStatus}`);
            return response.data;
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    },

    getOccupiedSeatsForShow: async (showId) => {
        try {
            const bookings = await bookingAPI.getBookingsByShow(showId);
            const occupiedSeats = [];

            // Extract seat IDs from all paid bookings
            if (Array.isArray(bookings)) {
                // Fetch seats from database for each booking
                await Promise.all(
                    bookings.map(async (booking) => {
                        // Only count seats from paid/completed bookings
                        if (booking.paymentStatus === 'Paid' || booking.paymentStatus === 'Completed') {
                            try {
                                const seats = await bookingAPI.getBookedSeats(booking.bookingId);
                                if (Array.isArray(seats)) {
                                    // Handle both string array ["A1", "A2"] and object array [{seatNo: "A1"}]
                                    const seatNos = seats.map(seat =>
                                        typeof seat === 'string' ? seat : seat.seatNo || seat.SeatNo
                                    );
                                    occupiedSeats.push(...seatNos);
                                }
                            } catch (error) {
                                console.error(`Error fetching seats for booking ${booking.bookingId}:`, error);
                            }
                        }
                    })
                );
            }

            return occupiedSeats;
        } catch (error) {
            console.error('Error fetching occupied seats:', error);
            return []; // Return empty array on error
        }
    },

    downloadTicketPdf: async (bookingId) => {
        try {
            const response = await api.get(`/booking/DownloadTicket/download/${bookingId}`, {
                responseType: 'blob' // Important for handling binary data
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading ticket PDF:', error);
            throw error;
        }
    },

    getQrCode: async (bookingId) => {
        try {
            const response = await api.get(`/booking/GetQrCode/qr/${bookingId}`, {
                responseType: 'blob' // Important for handling image data
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching QR code:', error);
            throw error;
        }
    },

    getMovieWiseCollection: async () => {
        try {
            const response = await api.get('/booking/GetMovieWiseCollection');
            return response.data;
        } catch (error) {
            console.error('Error fetching movie-wise collection:', error);
            throw error;
        }
    },
};

// ===== USER SERVICE =====
// Gateway routes /api/user/{everything}
export const userAPI = {
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/user/GetUserById/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/user/UpdateUser/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
};

// ===== REVIEW SERVICE =====
// Gateway routes /api/review/{everything}
export const reviewAPI = {
    getReviewsByMovie: async (movieId) => {
        try {
            const response = await api.get(`/review/GetReviews/movie/${movieId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    createReview: async (reviewData, userId) => {
        try {
            const response = await api.post(`/review/CreateReview?userId=${userId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    updateReview: async (reviewId, updateData, userId) => {
        try {
            const response = await api.put(`/review/UpdateReview/${reviewId}?userId=${userId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    getAllReviews: async () => {
        try {
            const response = await api.get('/review/GetAllReviews');
            return response.data;
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    },
};

export default api;
