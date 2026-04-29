import { Send, Bell, Users, MessageSquare } from 'lucide-react';

export const AdminPanel = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [isLoading, setIsLoading] = useState(false);
    const [recipientUsername, setRecipientUsername] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users`, {
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
        fetchUsers();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message) return;

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/notifications/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, message, type, recipientUsername: recipientUsername || null })
            });

            if (response.ok) {
                setTitle('');
                setMessage('');
                setRecipientUsername('');
            }
        } catch (error) {
            console.error('Failed to send notification', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-panel">
            <h2 className="panel-title">
                <Bell size={18} />
                <span>Send Notification</span>
            </h2>
            
            <form onSubmit={handleSend} className="admin-form">
                <div className="form-group">
                    <label>Recipient</label>
                    <select
                        value={recipientUsername}
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        className="user-select"
                    >
                        <option value="">Broadcast (All Users)</option>
                        {users.map(u => (
                            <option key={u.id} value={u.username}>
                                User: {u.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="admin-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Notification Title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        className="admin-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows="3"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Priority / Type</label>
                    <div className="type-selectors">
                        {['INFO', 'SUCCESS', 'WARNING', 'ERROR'].map(t => (
                            <label key={t} className="type-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value={t}
                                    checked={type === t}
                                    onChange={() => setType(t)}
                                />
                                <div className="type-box">
                                    {t}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-dispatch" disabled={isLoading || !title || !message}>
                    <Send size={16} />
                    {isLoading ? 'Sending...' : 'Send Now'}
                </button>
            </form>
        </div>
    );
};
