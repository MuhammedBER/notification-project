import React, { useState } from 'react';
import { Send, Gamepad2 } from 'lucide-react';
import './AdminPanel.css';
import { useNotifications } from './NotificationProvider';

export const AdminPanel = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [isLoading, setIsLoading] = useState(false);

    const [recipientUsername, setRecipientUsername] = useState('');
    const { setActiveGameId } = useNotifications();

    const handleChallenge = async () => {
        if (!recipientUsername) return;
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/game/challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetUsername: recipientUsername })
            });
            if (response.ok) {
                const game = await response.json();
                setActiveGameId(game.gameId);
            } else {
                alert("Failed to challenge user. Did you restart the server and enter a valid user?");
            }
        } catch (error) {
            console.error('Failed to issue challenge', error);
            alert("Network Error: Could not connect to backend server. Make sure it is running!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message) return;

        setIsLoading(true);
        // We use the auth token from localStorage just for demo, or context (but here localStorage is faster if we don't refactor AdminPanel to use context)
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/notifications/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, message, type, recipientUsername: recipientUsername || null })
            });

            if (response.ok) {
                setTitle('');
                setMessage('');
                setRecipientUsername('');
            }
        } catch (error) {
            console.error('Failed to send notification', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-panel glass">
            <div className="panel-header">
                <h2>Broadcast Event</h2>
            </div>
            <form onSubmit={handleSend} className="admin-form">
                <div className="form-group">
                    <label>Target User (Optional)</label>
                    <input
                        type="text"
                        value={recipientUsername}
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        placeholder="Leave blank for Global Broadcast"
                    />
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Server Update"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detailed message..."
                        rows="3"
                        required
                    />
                </div>
                <div className="form-group row">
                    <label>Type</label>
                    <div className="type-selectors">
                        {['INFO', 'SUCCESS', 'WARNING', 'ERROR'].map(t => (
                            <label key={t} className={`type-label ${type === t ? 'active' : ''} type-${t.toLowerCase()}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value={t}
                                    checked={type === t}
                                    onChange={() => setType(t)}
                                />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn-send" disabled={isLoading || !title || !message} style={{ flex: 1 }}>
                        <Send size={18} />
                        {isLoading ? 'Wait...' : 'Send Notification'}
                    </button>
                    <button type="button" className="btn-send" onClick={handleChallenge} disabled={isLoading || !recipientUsername} style={{ flex: 1, background: 'var(--success-color)' }}>
                        <Gamepad2 size={18} /> challenge XO
                    </button>
                </div>
            </form>
        </div>
    );
};
