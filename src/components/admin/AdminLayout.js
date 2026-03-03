import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ToastProvider } from './Toast';
import '../../styles/admin.css';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <ToastProvider>
            <div className="admin-container">
                <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

                <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <header className="admin-header">
                        <div className="header-left">
                            <button
                                className="sidebar-toggle mobile-only"
                                onClick={toggleMobileMenu}
                                style={{ display: 'none' }}
                            >
                                ☰
                            </button>
                        </div>

                        <div className="header-right">
                            <a
                                href="/"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s',
                                    marginRight: '16px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span>🎬</span>
                                Go to User Side
                            </a>

                            <div className="header-user">
                                <div className="user-avatar">A</div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Admin User</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: 1</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
};

export default AdminLayout;
