import React, { useState, useMemo } from 'react';
import type { User, ChatMessage } from '../types';
import { MinusIcon } from './icons';

interface ChatSidebarProps {
    friends: User[];
    chatMessages: ChatMessage[];
    currentUser: User;
    onOpenChat: (userId: string) => void;
    theme: { [key: string]: string };
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ friends, chatMessages, currentUser, onOpenChat, theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Memoize the calculation of unread messages for better performance,
    // especially with a large number of messages or frequent updates.
    const unreadCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const msg of chatMessages) {
            // Count messages sent to the current user that are unread
            if (msg.recipientId === currentUser.id && !msg.read) {
                const currentCount = counts.get(msg.senderId) || 0;
                counts.set(msg.senderId, currentCount + 1);
            }
        }
        return counts;
    }, [chatMessages, currentUser.id]);


    const statusColors: { [key: string]: string } = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        offline: 'bg-gray-400',
    };

    return (
        <div className="fixed bottom-0 right-24 w-60 z-[99]">
            <div className={`${theme.header} ${theme.headerText} rounded-t-md shadow-lg`}>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex justify-between items-center px-3 py-2 text-left"
                >
                    <span className="font-bold text-sm">Bate-papo ({friends.filter(f => f.onlineStatus !== 'offline').length})</span>
                    <MinusIcon className="w-4 h-4" />
                </button>
            </div>
            {!isCollapsed && (
                <div className={`${theme.panelBg} border-l border-r border-b ${theme.panelBorder} max-h-80 overflow-y-auto`}>
                    <ul>
                        {friends.sort((a,b) => {
                            if (a.onlineStatus === 'offline' && b.onlineStatus !== 'offline') return 1;
                            if (a.onlineStatus !== 'offline' && b.onlineStatus === 'offline') return -1;
                            return a.name.localeCompare(b.name);
                        }).map(friend => {
                            const unreadCount = unreadCounts.get(friend.id) || 0;
                            return (
                                <li key={friend.id}>
                                    <button 
                                        onClick={() => onOpenChat(friend.id)}
                                        className={`w-full text-left flex items-center space-x-2 p-2 ${theme.subtleBgHover} ${friend.onlineStatus === 'offline' ? 'opacity-60' : ''}`}
                                        aria-label={`${friend.name}${unreadCount > 0 ? `, ${unreadCount} new messages` : ''}`}
                                    >
                                        <div className="relative">
                                            <img src={friend.avatarUrl} alt={friend.name} className="w-8 h-8 rounded-full" />
                                            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${statusColors[friend.onlineStatus]} ring-2 ${theme.panelBg}`}></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${theme.text} truncate`}>{friend.name}</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" aria-hidden="true">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;