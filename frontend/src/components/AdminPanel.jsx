import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Send, Users } from 'lucide-react';

export function AdminPanel() {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [recipient, setRecipient] = useState('');
    const [users, setUsers] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/notifications/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    message,
                    type,
                    recipientUsername: recipient || null
                })
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Notification sent successfully!' });
                setTitle('');
                setMessage('');
            } else {
                setStatus({ type: 'error', message: 'Failed to send notification.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" />
                    Send Notification
                </CardTitle>
                <CardDescription>
                    Broadcast a message to all users or target a specific one.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSend}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Recipient</label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        >
                            <option value="">All Users (Global)</option>
                            {users.map(u => (
                                <option key={u.id} value={u.username}>
                                    {u.username} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="INFO">Information</option>
                            <option value="SUCCESS">Success</option>
                            <option value="WARNING">Warning</option>
                            <option value="ERROR">Error</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                            placeholder="Notification title..." 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    {status && (
                        <div className={cn(
                            "p-3 rounded-md text-sm font-medium",
                            status.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                            {status.message}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full gap-2" disabled={isSending}>
                        <Send className="w-4 h-4" />
                        {isSending ? "Sending..." : "Send Notification"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
