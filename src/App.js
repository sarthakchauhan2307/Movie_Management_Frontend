import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SelectShow from './pages/SelectShow';
import SelectSeats from './pages/SelectSeats';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';
import UserMovieCollection from './pages/UserMovieCollection';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Movies from './pages/admin/Movies';
import Theatres from './pages/admin/Theatres';
import Screens from './pages/admin/Screens';
import Shows from './pages/admin/Shows';
import Bookings from './pages/admin/Bookings';
import Users from './pages/admin/Users';
import MovieCollection from './pages/admin/MovieCollection';
import './styles/admin.css';

function App() {
    return (
        <AuthProvider>
            <CityProvider>
                <Router>
                    <Routes>
                        {/* Login Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Public/User Routes - Protected */}
                        <Route path="/" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <Home />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/movie/:id" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <MovieDetails />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/movie/:id/shows" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <SelectShow />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/show/:showId/seats" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <SelectSeats />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/booking/confirmation/:bookingId" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <BookingConfirmation />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/my-bookings" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <MyBookings />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <UserProfile />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/collections" element={
                            <PrivateRoute>
                                <div className="App">
                                    <Navbar />
                                    <UserMovieCollection />
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        } />

                        {/* Admin Routes - Protected for Admin Only */}
                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="movies" element={<Movies />} />
                            <Route path="theatres" element={<Theatres />} />
                            <Route path="screens" element={<Screens />} />
                            <Route path="shows" element={<Shows />} />
                            <Route path="bookings" element={<Bookings />} />
                            <Route path="users" element={<Users />} />
                            <Route path="movie-collection" element={<MovieCollection />} />
                        </Route>
                    </Routes>
                </Router>
            </CityProvider>
        </AuthProvider>
    );
}

export default App;


