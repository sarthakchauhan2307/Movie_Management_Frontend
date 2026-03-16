import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from '../../context/NotificationContext';
import { Bell, Send, X } from 'lucide-react';
import '../../styles/admin.css';

const AdminBroadcaster = () => {
    const { broadcastMessage } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const [broadcastText, setBroadcastText] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastStatus, setBroadcastStatus] = useState(null);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastText.trim()) return;
        
        setIsBroadcasting(true);
        setBroadcastStatus(null);
        
        const success = await broadcastMessage(broadcastText);
        
        if (success) {
            setBroadcastStatus({ type: 'success', message: 'Announcement broadcasted successfully!' });
            setBroadcastText('');
            setTimeout(() => {
                setBroadcastStatus(null);
                setIsOpen(false);
            }, 2000);
        } else {
            setBroadcastStatus({ type: 'error', message: 'Failed to broadcast announcement. Ensure SignalR connection is active.' });
        }
        
        setIsBroadcasting(false);
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                title="Broadcast Announcement"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: 'var(--primary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    marginRight: '16px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <Bell size={20} />
            </button>

            {isOpen && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '500px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        margin: '20px'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bell size={20} color="var(--primary)" />
                                Broadcast Announcement
                            </h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div style={{ padding: '24px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                Send a real-time notification to all active users. The announcement will be visible for 24 hours.
                            </p>
                            
                            <form onSubmit={handleBroadcast}>
                                <textarea
                                    value={broadcastText}
                                    onChange={(e) => setBroadcastText(e.target.value)}
                                    placeholder="Type your announcement message here..."
                                    rows={4}
                                    style={{ 
                                        width: '100%',
                                        resize: 'vertical', 
                                        marginBottom: '16px',
                                        padding: '12px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'inherit',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                    autoFocus
                                />
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '16px' }}>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={isBroadcasting || !broadcastText.trim()}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        {isBroadcasting ? (
                                            <>
                                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Broadcast to All
                                            </>
                                        )}
                                    </button>
                                    
                                    {broadcastStatus && (
                                        <span style={{ 
                                            color: broadcastStatus.type === 'success' ? 'var(--success)' : 'var(--error)',
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }}>
                                            {broadcastStatus.message}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>, 
                document.body
            )}
        </>
    );
};

export default AdminBroadcaster;
