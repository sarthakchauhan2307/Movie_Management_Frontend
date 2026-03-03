import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/admin.css';

const AdminSidebar = ({ collapsed, onToggle }) => {
    return (
        <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <span className="material-icons">movie</span>
                    </div>
                    {!collapsed && <span>CineAdmin</span>}
                </div>
                {!collapsed && (
                    <button className="sidebar-toggle" onClick={onToggle}>
                        <span className="material-icons">menu</span>
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                {!collapsed && <div className="sidebar-section-title">Main</div>}

                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Dashboard"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">dashboard_customize</span>
                    </span>
                    {!collapsed && <span>Dashboard</span>}
                </NavLink>

                {!collapsed && <div className="sidebar-section-title">Management</div>}

                <NavLink
                    to="/admin/movies"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Movies"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">movie_filter</span>
                    </span>
                    {!collapsed && <span>Movies</span>}
                </NavLink>

                <NavLink
                    to="/admin/theatres"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Theatres"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">theaters</span>
                    </span>
                    {!collapsed && <span>Theatres</span>}
                </NavLink>

                <NavLink
                    to="/admin/screens"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Screens"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">personal_video</span>
                    </span>
                    {!collapsed && <span>Screens</span>}
                </NavLink>

                <NavLink
                    to="/admin/shows"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Shows"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">calendar_today</span>
                    </span>
                    {!collapsed && <span>Shows</span>}
                </NavLink>

                {!collapsed && <div className="sidebar-section-title">Operations</div>}

                <NavLink
                    to="/admin/bookings"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Bookings"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">confirmation_number</span>
                    </span>
                    {!collapsed && <span>Bookings</span>}
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Users"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">group</span>
                    </span>
                    {!collapsed && <span>Users</span>}
                </NavLink>

                {!collapsed && <div className="sidebar-section-title">Analytics</div>}

                <NavLink
                    to="/admin/movie-collection"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    title="Movie Collection"
                >
                    <span className="sidebar-icon">
                        <span className="material-icons">payments</span>
                    </span>
                    {!collapsed && <span>Movie Collection</span>}
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminSidebar;
