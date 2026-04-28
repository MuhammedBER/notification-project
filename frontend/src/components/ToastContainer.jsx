import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationProvider';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const IconMap = {
    INFO: <Info className="w-5 h-5 text-blue-500" />,
    WARNING: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    SUCCESS: <CheckCircle className="w-5 h-5 text-green-500" />,
    ERROR: <XCircle className="w-5 h-5 text-red-500" />
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
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {activeToasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto flex items-start gap-3 rounded-lg border bg-background p-4 shadow-lg transition-all animate-in slide-in-from-right sm:slide-in-from-bottom">
                    <div className="mt-0.5">
                        {IconMap[toast.type] || IconMap['INFO']}
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium leading-none">{toast.title}</h4>
                        <p className="text-sm text-muted-foreground">{toast.message}</p>
                    </div>
                    <button 
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2" 
                        onClick={() => removeToast(toast.id)}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
