import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationProvider';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './Toast.css';

const IconMap = {
    INFO: <Info className="icon icon-info" />,
    WARNING: <AlertTriangle className="icon icon-warning" />,
    SUCCESS: <CheckCircle className="icon icon-success" />,
    ERROR: <XCircle className="icon icon-error" />
};

export const ToastContainer = () => {
    const { notifications, dismissNotification } = useNotifications();
    const [activeToasts, setActiveToasts] = useState([]);

    // Watch for new notifications and add them to active toasts
    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            // Check if it's new (in real app, we might check timestamps or have a 'viewed' flag)
            // For simplicity, we just add the newest one if it's not already in toasts
            if (!activeToasts.find(t => t.id === latest.id)) {
                setActiveToasts(prev => [latest, ...prev].slice(0, 5)); // Keep max 5 toasts
                
                // Auto-dismiss after 5 seconds
                const timer = setTimeout(() => {
                    removeToast(latest.id);
                }, 5000);
                
                return () => clearTimeout(timer);
            }
        }
    }, [notifications]);

    const removeToast = (id) => {
        setActiveToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="toast-container">
            {activeToasts.map(toast => (
                <div key={toast.id} className={`toast fade-in slide-in type-${toast.type}`}>
                    <div className="toast-icon">
                        {IconMap[toast.type] || IconMap['INFO']}
                    </div>
                    <div className="toast-content">
                        <h4>{toast.title}</h4>
                        <p>{toast.message}</p>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <X size={16} />
                    </button>
                    <div className="toast-progress"></div>
                </div>
            ))}
        </div>
    );
};
