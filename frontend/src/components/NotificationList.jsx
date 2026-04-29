import React from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './NotificationList.css';

const IconMap = {
    INFO: <Info size={16} />,
    WARNING: <AlertTriangle size={16} />,
    SUCCESS: <CheckCircle size={16} />,
    ERROR: <XCircle size={16} />
};

export const NotificationList = () => {
    const { notifications, isConnected } = useNotifications();

    return (
        <div className="notification-panel">
            <div className="panel-header">
                <div className="header-title">
                    <Bell size={16} />
                    <h2>Activity Feed</h2>
                </div>
                <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'Connected' : 'Offline'}
                </div>
            </div>
            
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="empty-state">No notifications to display.</div>
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
                                {notif.senderName && <div className="sender-tag">By: {notif.senderName}</div>}
                                <p className="notification-message">{notif.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
