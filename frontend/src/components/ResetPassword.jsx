import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';

export function ResetPassword() {
    const { resetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            setMessage('No reset token found.');
            return;
        }

        setStatus('submitting');
        try {
            const msg = await resetPassword(token, newPassword);
            setStatus('success');
            setMessage(msg);
        } catch (err) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Password Reset</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <p className="text-lg font-medium">{message}</p>
                        <Button onClick={() => window.location.href = '/'} className="w-full">
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your new password below.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <Input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <Input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {message && (
                            <p className={status === 'error' ? "text-destructive text-sm" : "text-sm"}>
                                {message}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full gap-2" disabled={status === 'submitting'}>
                            {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            Reset Password
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
