
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { apiUrl } from '../utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatAssistant: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useTheme();

    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const renderMessageContent = (content: string) => {
        // Custom component for rendering links
        const LinkRenderer = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
            if (href?.startsWith('/')) {
                return (
                    <Link
                        to={href}
                        className="text-sky-500 underline underline-offset-2 hover:text-sky-600"
                    >
                        {children}
                    </Link>
                );
            }
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 underline underline-offset-2 hover:text-sky-600"
                >
                    {children}
                </a>
            );
        };

        return (
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: LinkRenderer,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-md font-semibold mb-2 mt-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-medium mb-1 mt-2">{children}</h3>,
                        p: ({ children }) => <p className="mb-2">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children, ...props }: any) => {
                            const isInline = !props.className?.includes('language-');
                            return isInline ?
                                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code> :
                                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mb-2 overflow-x-auto">{children}</code>;
                        },
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    };

    // 🔥 Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 🔥 Welcome message
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content:
                        "👋 Hi! I'm your FertilizerHub assistant. Ask me about fertilizers, prices, or how to use this platform!",
                },
            ]);
        }
    }, [open]);

    // 🔥 Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // 🔥 Send message (CONNECTED TO YOUR BACKEND)
    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
        };

        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(apiUrl('/chat'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();

            const aiMessage: Message = {
                role: 'assistant',
                content:
                    data.reply ||
                    "⚠️ I couldn't find anything. Try another product.",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        '❌ Server error. Please try again or contact support.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🔵 Floating Button */}
            <motion.button
                onClick={() => setOpen((prev) => !prev)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-2xl transition-colors ${isDarkMode
                    ? 'bg-white text-black shadow-black/20'
                    : 'bg-slate-900 text-white shadow-slate-900/20'
                    }`}
            >
                <span className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-900/10'} animate-ping`} />
                <MessageCircle size={22} className="relative z-10" />
            </motion.button>

            {/* 🔵 Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* 🔵 Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={chatRef}
                        initial={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.95 }}
                        animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, x: '-50%' }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`fixed top-1/2 left-1/2 w-[90%] max-w-lg h-[80vh] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-xl flex flex-col z-[9999] ${isDarkMode
                            ? 'bg-slate-950/95 border-white/10'
                            : 'bg-white/95 border-slate-200'
                            }`}
                    >
                        {/* 🔴 Header */}
                        <div className={`flex justify-between items-center px-5 py-4 ${isDarkMode
                            ? 'bg-slate-900 text-white'
                            : 'bg-linear-to-r from-slate-900 to-black text-white'
                            }`}
                        >
                            <div>
                                <h2 className="text-sm font-semibold">
                                    FertilizerHub Assistant
                                </h2>
                                <p className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-gray-300'}`}>
                                    Get response within a second
                                </p>
                            </div>
                            <button onClick={() => setOpen(false)}>
                                <X size={18} className={isDarkMode ? 'text-white' : 'text-white'} />
                            </button>
                        </div>

                        {/* 🟢 Messages */}
                        <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${isDarkMode
                            ? 'bg-linear-to-b from-slate-900 to-slate-950'
                            : 'bg-linear-to-b from-gray-50 to-white'
                            }`}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`px-4 py-2 text-sm max-w-[75%] rounded-2xl shadow-sm ${msg.role === 'user'
                                            ? isDarkMode
                                                ? 'bg-slate-100 text-slate-950 rounded-br-none shadow-slate-800/10'
                                                : 'bg-slate-900 text-white rounded-br-none shadow-slate-900/10'
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-100 rounded-bl-none shadow-slate-900/10'
                                                : 'bg-white border text-gray-800 rounded-bl-none shadow-slate-200/50'
                                            }`}
                                    >
                                        {renderMessageContent(msg.content)}
                                    </div>
                                </motion.div>
                            ))}

                            {/* 🔄 Typing */}
                            {loading && (
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* 🔵 Input */}
                        <div className={`p-3 border-t flex items-center gap-2 ${isDarkMode ? 'border-slate-700 bg-slate-950' : 'border-gray-200 bg-white'
                            }`}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendMessage();
                                }}
                                placeholder="Ask about fertilizers or registration..."
                                className={`flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'border-slate-700 bg-slate-900 text-white focus:ring-slate-400'
                                    : 'border-gray-300 bg-white text-slate-950 focus:ring-black'
                                    }`}
                            />

                            <motion.button
                                onClick={sendMessage}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                                    }`}
                            >
                                <Send size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAssistant;