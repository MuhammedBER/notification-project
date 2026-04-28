import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchUserProfile(token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async (jwt) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/me`, {
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setToken(null);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        const data = await response.json();
        setToken(data.token);
    };

    const googleLogin = async (idToken) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        const data = await response.json();
        setToken(data.token);
    };

    const register = async (username, email, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        return await response.text(); // Return success message
    };

    const verifyEmail = async (token) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/verify?token=${token}`);
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        return await response.text();
    };

    const forgotPassword = async (email) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        return await response.text();
    };

    const resetPassword = async (token, newPassword) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        return await response.text();
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, googleLogin, register, logout, verifyEmail, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
