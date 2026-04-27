import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { User, Key, LogOut } from 'lucide-react';

export const Profile = () => {
    const { user, token, logout } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!newPassword) return;

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://192.168.100.12:8080/api/users/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                setMessage('Password updated successfully');
                setNewPassword('');
            } else {
                setError('Failed to update password');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-panel glass">
            <div className="panel-header">
                <h2>User Profile</h2>
            </div>

            <div className="profile-info">
                <div className="avatar">
                    <User size={32} />
                </div>
                <div>
                    <h3 className="username">@{user.username}</h3>
                    <span className="role-badge">{user.role}</span>
                </div>
            </div>

            <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                    <label><Key size={14} /> Change Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                    />
                </div>
                {message && <div className="success-msg">{message}</div>}
                {error && <div className="error-msg">{error}</div>}

                <button type="submit" className="btn-secondary" disabled={isLoading || !newPassword}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </form>

            <button onClick={logout} className="btn-logout">
                <LogOut size={16} /> Sign Out
            </button>
        </div>
    );
};
