import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';

const NotificationBanner = () => {
    const { notifications, dismissNotification } = useNotification();

    // Get unread or active notifications
    // Note: since notifications array in context already filters >24 hours,
    // we just need to display the ones that haven't been dismissed
    
    if (!notifications || notifications.length === 0) return null;

    // Optional: We can display only the most recent notification 
    // to avoid stacking multiple banners, or support stacking.
    // For now, let's display them in a list or stack.
    
    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '380px',
            width: '100%'
        }}>
            {notifications.map((notification) => (
                <div 
                    key={notification.id}
                    style={{
                        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
                        border: '1px solid var(--border)',
                        borderLeft: '4px solid var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        animation: 'slideInRight 0.3s ease-out forwards'
                    }}
                >
                    <div style={{
                        background: 'rgba(220, 38, 38, 0.1)',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bell size={20} color="var(--primary)" />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <h4 style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 600, 
                            marginBottom: '4px',
                            color: 'var(--text-primary)' 
                        }}>
                            From: {notification.sender}
                        </h4>
                        <p style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            margin: 0
                        }}>
                            {notification.message}
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => dismissNotification(notification.id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <X size={18} />
                    </button>
                    
                    <style>{`
                        @keyframes slideInRight {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default NotificationBanner;
