
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { User, Notification } from '../types';
import type { CurrentPage } from '../App';
import { SearchIcon, BellIcon, UserIcon, HeartIcon, MessageIcon } from './icons';

// --- NOTIFICATIONS PANEL COMPONENT --- //

const getNotificationText = (type: Notification['type']) => {
    switch (type) {
        case 'friend_request': return 'enviou um pedido de amizade.';
        case 'new_like': return 'curtiu seu post.';
        case 'new_comment': return 'comentou no seu post.';
        default: return 'interagiu com você.';
    }
}

const getNotificationIcon = (type: Notification['type'], theme: { [key: string]: string }) => {
    const className = `w-5 h-5 ${theme.buttonText}`;
    switch (type) {
        case 'friend_request': return <UserIcon className={className} />;
        case 'new_like': return <HeartIcon filled className={className} />;
        case 'new_comment': return <MessageIcon className={className} />;
        default: return null;
    }
}

interface NotificationsPanelProps {
    notifications: Notification[];
    users: { [key: string]: User };
    onClose: () => void;
    onMarkAsRead: (notificationId: number, callback?: () => void) => void;
    onMarkAllAsRead: () => void;
    onNavigate: (page: CurrentPage) => void;
    onViewProfile: (userId: string) => void;
    theme: { [key: string]: string };
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, users, onClose, onMarkAsRead, onMarkAllAsRead, onNavigate, onViewProfile, theme }) => {
    
    const handleNotificationClick = (notification: Notification) => {
        let navigationCallback: (() => void) | undefined;

        switch (notification.type) {
            case 'friend_request':
                navigationCallback = () => onNavigate('friends');
                break;
            case 'new_like':
            case 'new_comment':
                navigationCallback = () => onNavigate('posts');
                break;
            default:
                navigationCallback = undefined;
        }
        
        onMarkAsRead(notification.id, navigationCallback);
        onClose();
    };

    return (
        <div className={`absolute top-full right-0 mt-2 w-80 md:w-96 ${theme.panelBg} border ${theme.panelBorder} rounded-md shadow-lg z-20`}>
            <div className={`flex justify-between items-center p-3 border-b ${theme.panelBorder}`}>
                <h3 className={`font-bold ${theme.text}`}>Notificações</h3>
                {notifications.some(n => !n.read) && (
                    <button onClick={onMarkAllAsRead} className={`text-xs ${theme.link} hover:underline`}>
                        Marcar todas como lidas
                    </button>
                )}
            </div>
            <ul className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => {
                        const actor = users[notification.actorId];
                        if (!actor) return null;

                        return (
                            <li key={notification.id} className={`${!notification.read ? theme.subtleBg : ''}`}>
                                <button onClick={() => handleNotificationClick(notification)} className={`w-full text-left flex items-start space-x-3 p-3 ${theme.subtleBgHover}`}>
                                    <div className="relative">
                                        <img src={actor.avatarUrl} alt={actor.name} className="w-10 h-10 rounded-full" />
                                        <span className={`absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full ${theme.button}`}>
                                            {getNotificationIcon(notification.type, theme)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${theme.text}`}>
                                            <span className="font-bold">{actor.name}</span> {getNotificationText(notification.type)}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${!notification.read ? 'text-blue-600 font-semibold' : theme.subtleText}`}>
                                            {new Date(notification.timestamp).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center flex-shrink-0"></div>}
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li className={`p-4 text-center text-sm ${theme.subtleText}`}>
                        Nenhuma notificação ainda.
                    </li>
                )}
            </ul>
        </div>
    );
};


// --- HEADER COMPONENT --- //

interface HeaderProps {
    currentUser: User;
    onNavigate: (page: CurrentPage) => void;
    onViewProfile: (userId: string) => void;
    allUsers: User[];
    onLogout: () => void;
    theme: { [key: string]: string };
    notifications: Notification[];
    users: { [key: string]: User };
    onMarkAsRead: (notificationId: number, callback?: () => void) => void;
    onMarkAllAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onViewProfile, allUsers, onLogout, theme, notifications, users, onMarkAsRead, onMarkAllAsRead }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isNotificationsOpen && notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotificationsOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim()) {
            const lowercasedTerm = term.toLowerCase();
            const results = allUsers.filter(user =>
                (user.name.toLowerCase().includes(lowercasedTerm) || user.city.toLowerCase().includes(lowercasedTerm)) 
                && user.id !== currentUser.id
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleProfileClick = (userId: string) => {
        setSearchTerm('');
        setSearchResults([]);
        onViewProfile(userId);
    };
    
    return (
        <header className={`${theme.header} ${theme.headerText} shadow-md`}>
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <button onClick={() => onNavigate('profile')} className="text-2xl font-bold">OldKut</button>
                
                <div className="relative flex-grow max-w-lg mx-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar no OldKut..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsNotificationsOpen(false)}
                        className={`block w-full ${theme.inputBg} ${theme.text} rounded-md py-1.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-white`}
                    />
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                            <ul>
                                {searchResults.map(user => (
                                    <li key={user.id}>
                                        <button onClick={() => handleProfileClick(user.id)} className="w-full text-left flex items-center space-x-3 p-2 hover:bg-gray-100">
                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-sm" />
                                            <span className="text-sm text-gray-800">{user.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <nav className="flex items-center space-x-6">
                        <button onClick={() => onNavigate('friends')} className="hover:opacity-80">
                            Amigos
                        </button>
                         <div ref={notificationsRef} className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(prev => !prev)}
                                className="relative hover:opacity-80"
                                aria-label={`${unreadCount} unread notifications`}
                            >
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-pink-500">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <NotificationsPanel
                                    notifications={notifications}
                                    users={users}
                                    onClose={() => setIsNotificationsOpen(false)}
                                    onMarkAsRead={onMarkAsRead}
                                    onMarkAllAsRead={onMarkAllAsRead}
                                    onNavigate={onNavigate}
                                    onViewProfile={onViewProfile}
                                    theme={theme}
                                />
                            )}
                        </div>
                    </nav>
                    <div className="flex items-center space-x-4 ml-6">
                        <div className="flex items-center space-x-2">
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full" />
                            <span className="text-sm">{currentUser.name}</span>
                        </div>
                        <button onClick={onLogout} className="text-xs opacity-70 hover:underline">Sair</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
