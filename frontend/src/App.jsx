import React from 'react';
import { NotificationList } from './components/NotificationList';
import { ToastContainer } from './components/ToastContainer';
import { AdminPanel } from './components/AdminPanel';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { VerifyEmail } from './components/VerifyEmail';
import { ResetPassword } from './components/ResetPassword';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationProvider';

function AppContent() {
    const { user, isLoading } = useAuth();
    const path = window.location.pathname;

    if (path === '/verify') {
        return <VerifyEmail />;
    }

    if (path === '/reset-password') {
        return <ResetPassword />;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-pulse text-2xl font-bold text-primary">Loading Dashboard...</div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Notification Center
                    </h1>
                </div>
            </header>
            
            <main className="container grid gap-8 py-8 md:grid-cols-[300px_1fr]">
                <aside className="space-y-6">
                    <Profile />
                    <AdminPanel />
                </aside>
                <section className="space-y-6">
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
