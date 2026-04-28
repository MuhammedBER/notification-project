import React from 'react';
import { NotificationList } from './components/NotificationList';
import { ToastContainer } from './components/ToastContainer';
import { AdminPanel } from './components/AdminPanel';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { TicTacToe } from './components/TicTacToe';
import { useAuth } from './context/AuthContext';
import { useNotifications, NotificationProvider } from './components/NotificationProvider';
import './App.css';

function AppContent() {
    const { user, isLoading } = useAuth();
    const { activeGameId, setActiveGameId } = useNotifications();

    if (isLoading) {
        return <div style={{ display:'flex', justifyContent:'center', marginTop:'20vh' }}>Loading Dashboard...</div>;
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app-container fade-in">
            <header className="app-header">
                <h1>Real-Time Operations Center</h1>
            </header>
            
            <main className="app-content">
                <div className="left-column">
                    <Profile />
                    <AdminPanel />
                </div>
                <div className="right-column">
                    {activeGameId ? (
                        <TicTacToe gameId={activeGameId} onExit={() => setActiveGameId(null)} />
                    ) : (
                        <NotificationList />
                    )}
                </div>
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
