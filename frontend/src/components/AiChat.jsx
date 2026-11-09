import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContent } from './context/AppContext';
import { Link } from 'react-router-dom';

function AiChat() {
    const { backend_url, user } = useContext(AppContent);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: "👋 Hi! I'm your Anime AI Assistant.\n\nAsk me anything — recommend anime, ask about a show, or get personalised picks based on your watchlist!",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(backend_url + '/api/ai/chat', {
                message: trimmed,
                userId: user ? user.id : null,
                userName: user ? user.name : null,
            });

            if (res.data.success) {
                setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: 'ai', text: '⚠️ Sorry, something went wrong. Please try again.' },
                ]);
            }
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: 'ai', text: '⚠️ Could not connect to AI. Check your connection.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* ── Floating Button ───────────────────────────────────────── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/40 flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-200"
                aria-label="Open AI Chat"
            >
                {isOpen ? '✕' : '🤖'}
            </button>

            {/* ── Chat Window ───────────────────────────────────────────── */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[520px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-700 to-red-900 border-b border-white/10">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <p className="text-white font-bold text-sm">Anime AI Assistant</p>
                            <p className="text-red-200 text-xs">
                                {user
                                    ? `Personalised for ${user.name}`
                                    : 'Login for personalised picks'}
                            </p>
                        </div>
                        {!user && (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="ml-auto text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-red-600 text-white rounded-br-sm'
                                            : 'bg-white/10 text-gray-100 rounded-bl-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Loading dots */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-gray-300 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick prompts */}
                    <div className="px-3 pb-2 flex gap-2 flex-wrap">
                        {['Suggest anime for me', 'Best anime series', 'Dark anime like AOT'].map(q => (
                            <button
                                key={q}
                                onClick={() => { setInput(q); }}
                                className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="px-3 pb-3">
                        <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
                            <textarea
                                rows={1}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about anime..."
                                className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder-gray-500 max-h-20"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0"
                            >
                                ▶
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">Press Enter to send</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default AiChat;

