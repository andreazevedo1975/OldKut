import React, { useState, useEffect, useRef } from 'react';
import type { User, ChatMessage } from '../types';
import { XIcon } from './icons';

interface ChatWindowProps {
    currentUser: User;
    friend: User;
    messages: ChatMessage[];
    onSendMessage: (content: string) => void;
    onClose: () => void;
    theme: { [key: string]: string };
    zIndex: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, friend, messages, onSendMessage, onClose, theme, zIndex }) => {
    const [newMessage, setNewMessage] = useState('');
    const [position, setPosition] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 400 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.chat-header')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);
    
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div
            ref={chatWindowRef}
            className={`fixed w-72 h-96 flex flex-col ${theme.panelBg} border ${theme.panelBorder} rounded-t-lg shadow-2xl`}
            style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex }}
            onMouseDown={handleMouseDown}
        >
            <header className={`chat-header ${theme.header} ${theme.headerText} rounded-t-lg px-3 py-1.5 flex justify-between items-center cursor-move`}>
                <span className="text-sm font-bold">{friend.name}</span>
                <button onClick={onClose} className="hover:opacity-70">
                    <XIcon className="w-4 h-4" />
                </button>
            </header>
            
            <div className="flex-1 p-2 overflow-y-auto flex flex-col space-y-2">
                {messages.map((msg, index) => {
                    const isSentByMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-2 rounded-lg ${isSentByMe ? 'bg-blue-500 text-white' : theme.subtleBg}`}>
                                <p className={`text-sm ${isSentByMe ? '' : theme.text}`}>{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>

            <div className={`p-2 border-t ${theme.panelBorder}`}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className={`w-full px-3 py-1.5 border ${theme.panelBorder} rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                    />
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;