import React from 'react';
import { NotificationList } from './components/NotificationList';
import { ToastContainer } from './components/ToastContainer';
import { AdminPanel } from './components/AdminPanel';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';
import { useNotifications, NotificationProvider } from './components/NotificationProvider';
import './App.css';

function AppContent() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading Workspace...</p>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app-container fade-in">
            <header className="app-header">
                <h1>Notification Management</h1>
                <div className="user-badge">
                    <span>Logged in as: <strong>{user.username}</strong></span>
                </div>
            </header>
            
            <main className="app-content">
                <aside className="left-column">
                    <Profile />
                    <AdminPanel />
                </aside>
                
                <section className="right-column">
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <span className="stat-label">Active Signals</span>
                            <span className="stat-value">Healthy</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">System Node</span>
                            <span className="stat-value">Primary</span>
                        </div>
                    </div>
                    <NotificationList />
                </section>
            </main>
            
            <ToastContainer />
        </div>
    );
}

function App() {
  return (
    <NotificationProvider>
        <AppContent />
    </NotificationProvider>
  );
}

export default App;
