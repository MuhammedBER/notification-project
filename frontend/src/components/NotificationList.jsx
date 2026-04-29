import React from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './NotificationList.css';

const IconMap = {
    INFO: <Info size={18} />,
    WARNING: <AlertTriangle size={18} />,
    SUCCESS: <CheckCircle size={18} />,
    ERROR: <XCircle size={18} />
};

export const NotificationList = () => {
    const { notifications, isConnected } = useNotifications();

    return (
        <div className="notification-panel glass-card">
            <div className="panel-header">
                <div className="header-title">
                    <Bell size={20} className="text-gradient" />
                    <h2>Feed</h2>
                </div>
                <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'Sync Active' : 'Offline'}
                </div>
            </div>
            
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="empty-state">No transmissions recorded.</div>
                ) : (
                    notifications.map((notif, idx) => (
                        <div key={notif.id || idx} className="notification-item">
                            <div className={`icon-wrapper type-${notif.type.toLowerCase()}`}>
                                {IconMap[notif.type] || IconMap['INFO']}
                            </div>
                            <div className="notification-content">
                                <div className="notification-meta">
                                    <h4>{notif.title}</h4>
                                    <span className="time">
                                        {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                {notif.senderName && <div className="sender-tag">Dispatcher: {notif.senderName}</div>}
                                <p className="notification-message">{notif.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
