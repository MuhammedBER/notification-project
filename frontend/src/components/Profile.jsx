import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { User, Key, LogOut, Shield } from 'lucide-react';

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
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/me/password`, {
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
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-secondary rounded-full">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-lg">@{user.username}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        {user.role}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{user.email}</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Key size={12} /> Change Password
                    </label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                    />
                    {message && <div className="text-xs text-green-600">{message}</div>}
                    {error && <div className="text-xs text-destructive">{error}</div>}
                    <Button type="submit" size="sm" className="w-full" disabled={isLoading || !newPassword}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={logout} variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
                    <LogOut size={14} /> Sign Out
                </Button>
            </CardFooter>
        </Card>
    );
};
