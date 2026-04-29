import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export const Login = () => {
    const { login, register } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLoginView) {
                await login(username, password);
            } else {
                await register(username, password);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="subtitle">Sign in to access your operations dashboard</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>
                
                <div className="switch-view">
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => setIsLoginView(!isLoginView)}>
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};
