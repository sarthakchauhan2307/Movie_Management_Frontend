import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

let toastId = 0;

const ICONS = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
};

const TITLES = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
};

const ToastItem = ({ toast, onRemove }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onRemove(toast.id), 350);
        }, toast.duration || 3500);
        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => onRemove(toast.id), 350);
    };

    return (
        <div className={`toast ${toast.type} ${exiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon-wrap">
                <span className="material-icons toast-icon">
                    {ICONS[toast.type] || ICONS.info}
                </span>
            </div>
            <div className="toast-content">
                <div className="toast-title">{toast.title || TITLES[toast.type]}</div>
                <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={handleClose}>
                <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
            </button>
            <div
                className="toast-progress"
                style={{ animationDuration: `${(toast.duration || 3500) / 1000}s` }}
            />
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success', options = {}) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, ...options }]);
    }, []);

    // Convenience methods
    const toastAPI = {
        success: (message, options) => showToast(message, 'success', options),
        error: (message, options) => showToast(message, 'error', options),
        warning: (message, options) => showToast(message, 'warning', options),
        info: (message, options) => showToast(message, 'info', options),
    };

    return (
        <ToastContext.Provider value={toastAPI}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
