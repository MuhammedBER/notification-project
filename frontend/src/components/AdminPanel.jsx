import { Send, Zap, Users, MessageSquare, Terminal } from 'lucide-react';

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
        <div className="admin-panel glass-card">
            <h2 className="panel-title">
                <Terminal size={20} className="text-gradient" />
                <span>Dispatch Center</span>
            </h2>
            
            <form onSubmit={handleSend} className="admin-form">
                <div className="form-group">
                    <label>
                        <Users size={14} style={{ marginRight: '6px' }} />
                        Target Audience
                    </label>
                    <select
                        value={recipientUsername}
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        className="user-select"
                    >
                        <option value="">Global Broadcast</option>
                        {users.map(u => (
                            <option key={u.id} value={u.username}>
                                Node: {u.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <Zap size={14} style={{ marginRight: '6px' }} />
                        Signal Title
                    </label>
                    <input
                        type="text"
                        className="admin-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Define signal header..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <MessageSquare size={14} style={{ marginRight: '6px' }} />
                        Payload
                    </label>
                    <textarea
                        className="admin-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter transmission data..."
                        rows="3"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Classification</label>
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
                                <div className={`type-box type-${t.toLowerCase()}`}>
                                    {t}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-premium btn-dispatch" disabled={isLoading || !title || !message}>
                    <Send size={18} />
                    {isLoading ? 'Transmitting...' : 'Dispatch Signal'}
                </button>
            </form>
        </div>
    );
};
