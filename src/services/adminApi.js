import api from './api';

// ===== ADMIN MOVIE APIS =====
export const adminMovieAPI = {
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

    createMovie: async (movieData) => {
        try {
            const response = await api.post('/movies/AddMovie', movieData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating movie:', error);
            throw error;
        }
    },

    updateMovie: async (id, movieData) => {
        try {
            const response = await api.put(`/movies/UpdateMovie/${id}`, movieData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating movie:', error);
            throw error;
        }
    },

    deleteMovie: async (id) => {
        try {
            const response = await api.delete(`/movies/DeleteMovie/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
        }
    },
};

// ===== ADMIN THEATRE APIS =====
export const adminTheatreAPI = {
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

    createTheatre: async (theatreData) => {
        try {
            const response = await api.post('/theatre/Theatre/AddTheatre', theatreData);
            return response.data;
        } catch (error) {
            console.error('Error creating theatre:', error);
            throw error;
        }
    },

    updateTheatre: async (id, theatreData) => {
        try {
            const response = await api.put(`/theatre/Theatre/UpdateTheatre/${id}`, theatreData);
            return response.data;
        } catch (error) {
            console.error('Error updating theatre:', error);
            throw error;
        }
    },

    deleteTheatre: async (id) => {
        try {
            const response = await api.delete(`/theatre/Theatre/DeleteTheatre/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting theatre:', error);
            throw error;
        }
    },

    getTheatreWiseScreenCount: async () => {
        try {
            const response = await api.get('/theatre/Theatre/GetTheatreWiseScreenCount/theatre-wise-screen-count');
            return response.data;
        } catch (error) {
            console.error('Error fetching theatre-wise screen count:', error);
            throw error;
        }
    },
};

// ===== ADMIN SCREEN APIS =====
export const adminScreenAPI = {
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

    createScreen: async (screenData) => {
        try {
            const response = await api.post('/theatre/Screen/AddScreen', screenData);
            return response.data;
        } catch (error) {
            console.error('Error creating screen:', error);
            throw error;
        }
    },

    updateScreen: async (id, screenData) => {
        try {
            const response = await api.put(`/theatre/Screen/UpdateScreen/${id}`, screenData);
            return response.data;
        } catch (error) {
            console.error('Error updating screen:', error);
            throw error;
        }
    },

    deleteScreen: async (id) => {
        try {
            const response = await api.delete(`/theatre/Screen/DeleteScreen/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting screen:', error);
            throw error;
        }
    },
};

// ===== ADMIN SHOW APIS =====
export const adminShowAPI = {
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
            console.error('Error fetching shows by movie:', error);
            throw error;
        }
    },

    createShow: async (showData) => {
        try {
            const response = await api.post('/theatre/Show/AddShow', showData);
            return response.data;
        } catch (error) {
            console.error('Error creating show:', error);
            throw error;
        }
    },

    updateShow: async (id, showData) => {
        try {
            const response = await api.put(`/theatre/Show/UpdateShow/${id}`, showData);
            return response.data;
        } catch (error) {
            console.error('Error updating show:', error);
            throw error;
        }
    },

    deleteShow: async (id) => {
        try {
            const response = await api.delete(`/theatre/Show/DeleteShow/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting show:', error);
            throw error;
        }
    },
};

// ===== ADMIN BOOKING APIS =====
export const adminBookingAPI = {
    getAllBookings: async () => {
        try {
            // We'll need to get all bookings - assuming there's an endpoint for this
            // If not, we might need to aggregate from different sources
            const response = await api.get('/booking/GetBookings');
            return response.data;
        } catch (error) {
            console.error('Error fetching all bookings:', error);
            // Fallback: return empty array if endpoint doesn't exist yet
            return [];
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

    getBookingsByShow: async (showId) => {
        try {
            const response = await api.get(`/booking/GetBookingsByShow/show/${showId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings by show:', error);
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

    cancelBooking: async (id) => {
        try {
            const response = await api.put(`/booking/CancelBooking/cancel/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    },
};

// ===== ADMIN USER APIS =====
// ===== ADMIN USER APIS =====
export const adminUserAPI = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/user/GetUser');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await api.get(`/user/GetUserById/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/user/CreateUser', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/user/UpdateUser/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/user/DeleteUser/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
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
};

// ===== ADMIN ANALYTICS APIS =====
export const adminAnalyticsAPI = {
    getDashboardStats: async (dateRange = 'lifetime') => {
        try {
            // This will aggregate data from multiple endpoints
            const [movies, theatres, bookings] = await Promise.all([
                adminMovieAPI.getMovies(),
                adminTheatreAPI.getTheatres(),
                adminBookingAPI.getAllBookings(),
            ]);

            // Helper function to get date range filter
            const getDateRangeFilter = () => {
                const now = new Date();
                switch (dateRange) {
                    case 'today':
                        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        return (booking) => new Date(booking.created) >= startOfToday;
                    case '7days':
                        const last7Days = new Date(now);
                        last7Days.setDate(last7Days.getDate() - 7);
                        return (booking) => new Date(booking.created) >= last7Days;
                    case '30days':
                        const last30Days = new Date(now);
                        last30Days.setDate(last30Days.getDate() - 30);
                        return (booking) => new Date(booking.created) >= last30Days;
                    case 'lifetime':
                    default:
                        return () => true; // No filter
                }
            };

            // Filter bookings based on date range
            const dateFilter = getDateRangeFilter();
            const filteredBookings = Array.isArray(bookings)
                ? bookings.filter(dateFilter)
                : [];

            // Calculate stats from filtered bookings
            const totalRevenue = filteredBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
            const totalBookings = filteredBookings.length;

            return {
                totalMovies: Array.isArray(movies) ? movies.length : 0,
                totalTheatres: Array.isArray(theatres) ? theatres.length : 0,
                totalBookings,
                totalRevenue,
                recentBookings: filteredBookings
                    .sort((a, b) => new Date(b.created) - new Date(a.created))
                    .slice(0, 10),
                dateRange, // Include selected range in response
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalMovies: 0,
                totalTheatres: 0,
                totalBookings: 0,
                totalRevenue: 0,
                recentBookings: [],
                dateRange,
            };
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
