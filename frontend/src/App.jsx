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
                <p>Synchronizing systems...</p>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app-container slide-up">
            <header className="app-header">
                <h1 className="text-gradient">Nova Command</h1>
                <div className="user-badge glass-card">
                    <div className="status-dot online"></div>
                    <span>System Active</span>
                </div>
            </header>
            
            <main className="app-content">
                <aside className="left-column">
                    <Profile />
                    <AdminPanel />
                </aside>
                
                <section className="right-column">
                    <div className="dashboard-stats">
                        <div className="stat-card glass-card">
                            <span className="stat-label">System Health</span>
                            <span className="stat-value">99.9%</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-label">Response Time</span>
                            <span className="stat-value">24ms</span>
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
