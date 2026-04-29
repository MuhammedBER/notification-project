import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationProvider';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './Toast.css';

const IconMap = {
    INFO: <Info size={18} />,
    WARNING: <AlertTriangle size={18} />,
    SUCCESS: <CheckCircle size={18} />,
    ERROR: <XCircle size={18} />
};

export const ToastContainer = () => {
    const { notifications } = useNotifications();
    const [activeToasts, setActiveToasts] = useState([]);

    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            if (!activeToasts.find(t => t.id === latest.id)) {
                setActiveToasts(prev => [latest, ...prev].slice(0, 5));
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
                <div key={toast.id} className={`toast slide-up type-${toast.type}`}>
                    <div className="toast-icon">
                        {IconMap[toast.type] || IconMap['INFO']}
                    </div>
                    <div className="toast-content">
                        <h4>{toast.title}</h4>
                        <p>{toast.message}</p>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <X size={18} />
                    </button>
                    <div className="toast-progress"></div>
                </div>
            ))}
        </div>
    );
};
