import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { LogIn, UserPlus, Mail, Lock, User, Loader2, Key } from 'lucide-react';

export function Login() {
    const { login, googleLogin, register, forgotPassword } = useAuth();
    const [mode, setMode] = useState('login'); // login, register, forgot
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'login') {
                await login(username, password);
            } else if (mode === 'register') {
                const msg = await register(username, email, password);
                setSuccess(msg);
                setMode('login');
            } else if (mode === 'forgot') {
                const msg = await forgotPassword(email);
                setSuccess(msg);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
        } catch (err) {
            setError("Google Login failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
            <Card className="w-full max-w-md shadow-2xl transition-all duration-300 hover:shadow-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <LogIn className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
                    </CardTitle>
                    <CardDescription>
                        {mode === 'login' ? 'Enter your credentials to access your account' : 
                         mode === 'register' ? 'Join our community today' : 
                         'We will send you a link to reset your password'}
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-100 text-green-800 text-sm rounded-md border border-green-200">
                                {success}
                            </div>
                        )}

                        {mode !== 'forgot' && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-10" 
                                        placeholder="Username" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                        )}

                        {(mode === 'register' || mode === 'forgot') && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-10" 
                                        type="email" 
                                        placeholder="Email Address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                        )}

                        {mode !== 'forgot' && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-10" 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className="text-right">
                                <button 
                                    type="button"
                                    onClick={() => setMode('forgot')}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : mode === 'login' ? (
                                <LogIn className="w-4 h-4" />
                            ) : mode === 'register' ? (
                                <UserPlus className="w-4 h-4" />
                            ) : (
                                <Key className="w-4 h-4" />
                            )}
                            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : 'Send Reset Link'}
                        </Button>

                        {mode === 'login' && (
                            <div className="w-full flex flex-col items-center gap-4">
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError("Google Login Failed")}
                                        useOneTap
                                        theme="outline"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-center text-sm text-muted-foreground mt-2">
                            {mode === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button type="button" onClick={() => setMode('register')} className="text-primary hover:underline">Sign Up</button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline">Sign In</button>
                                </>
                            )}
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
