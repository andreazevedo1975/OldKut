import React, { useState, useEffect, useRef } from 'react';
import type { User, ChatMessage, LinkPreviewData } from '../types';
import { XIcon } from './icons';

// A regex to find URLs in text content.
const URL_REGEX_DISPLAY = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

/**
 * A utility function that parses a string and returns React elements
 * with any found URLs wrapped in an anchor `<a>` tag.
 */
const renderTextWithLinks = (text: string, linkClassName: string) => {
    const parts = text.split(URL_REGEX_DISPLAY);
    const links = text.match(URL_REGEX_DISPLAY) || [];
    
    return React.createElement(
        'span',
        null, // no props for the container span
        parts.map((part, index) => {
            const link = links[index];
            return [
                part, // The text part
                link ? React.createElement('a', {
                    href: link,
                    target: '_blank',
                    rel: 'noopener noreferrer', // Security best practice
                    className: linkClassName,
                    key: link + index,
                    onClick: (e) => e.stopPropagation() // Prevent click bubbling
                }, link) : null
            ];
        })
    );
};

/**
 * A component to display a compact preview card for a URL inside a chat bubble.
 */
const LinkPreviewCard: React.FC<{ data: LinkPreviewData, theme: { [key: string]: string }, isSentByMe: boolean }> = ({ data, theme, isSentByMe }) => (
    <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 block border ${isSentByMe ? 'border-blue-400' : theme.panelBorder} rounded-lg overflow-hidden bg-white/20 hover:bg-white/30 no-underline`}
    >
        {data.image && (
             <div className="max-h-24 overflow-hidden bg-gray-200">
                <img src={data.image} alt={data.title} className="w-full h-auto object-cover" />
            </div>
        )}
        <div className="p-2">
            <h4 className={`font-bold text-xs leading-tight ${isSentByMe ? 'text-white' : theme.text}`}>{data.title}</h4>
            <p className={`text-xs ${isSentByMe ? 'text-blue-100' : theme.subtleText} mt-1 line-clamp-2`}>{data.description}</p>
        </div>
    </a>
);


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
                {messages.map((msg) => {
                    const isSentByMe = msg.senderId === currentUser.id;
                    const linkClassName = isSentByMe ? 'underline font-semibold' : `${theme.link} underline`;
                    return (
                        <div key={msg.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-2 rounded-lg ${isSentByMe ? 'bg-blue-500 text-white' : theme.subtleBg}`}>
                                <div className={`text-sm ${isSentByMe ? '' : theme.text} whitespace-pre-wrap break-words`}>
                                    {renderTextWithLinks(msg.content, linkClassName)}
                                </div>
                                {msg.linkPreview && <LinkPreviewCard data={msg.linkPreview} theme={theme} isSentByMe={isSentByMe} />}
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