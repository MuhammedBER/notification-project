import React from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './NotificationList.css';

const IconMap = {
    INFO: <Info className="icon icon-info" />,
    WARNING: <AlertTriangle className="icon icon-warning" />,
    SUCCESS: <CheckCircle className="icon icon-success" />,
    ERROR: <XCircle className="icon icon-error" />
};

export const NotificationList = () => {
    const { notifications, isConnected } = useNotifications();

    return (
        <div className="notification-panel glass slide-in">
            <div className="panel-header">
                <div className="header-title">
                    <Bell className="header-icon" />
                    <h2>Notifications</h2>
                </div>
                <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'Live' : 'Reconnecting...'}
                </div>
            </div>
            
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="empty-state">No notifications.</div>
                ) : (
                    notifications.map((notif, idx) => (
                        <div key={notif.id || idx} className="notification-item">
                            <div className="notification-icon">
                                {IconMap[notif.type] || IconMap['INFO']}
                            </div>
                            <div className="notification-content">
                                <div className="notification-header">
                                    <h4>{notif.title}</h4>
                                    <span className="time">
                                        {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p>{notif.message}</p>
                                {notif.title === 'Game Challenge!' && notif.message.includes('Game ID: ') && (
                                    <button 
                                        className="btn-join-game"
                                        onClick={() => {
                                            const idMatch = notif.message.match(/Game ID: ([a-zA-Z0-9-]+)/);
                                            if (idMatch) useNotifications().setActiveGameId(idMatch[1]);
                                        }}
                                        style={{ marginTop: '8px', padding: '4px 8px', background: 'var(--success-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'0.75rem', fontWeight:'bold' }}
                                    >
                                        Join Game
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
