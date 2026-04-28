import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmail() {
    const { verifyEmail } = useAuth();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            verifyEmail(token)
                .then(msg => {
                    setStatus('success');
                    setMessage(msg);
                })
                .catch(err => {
                    setStatus('error');
                    setMessage(err.message);
                });
        } else {
            setStatus('error');
            setMessage('No verification token found.');
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>Confirming your email address...</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center">
                    {status === 'verifying' && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p>Please wait while we verify your account.</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-lg font-medium">{message}</p>
                            <Button onClick={() => window.location.href = '/'} className="w-full">
                                Go to Login
                            </Button>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <XCircle className="h-12 w-12 text-destructive" />
                            <p className="text-lg font-medium text-destructive">{message}</p>
                            <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
                                Back to Login
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
