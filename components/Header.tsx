

import React, { useState, useRef, useEffect } from 'react';
import type { User, Notification } from '../types';
import { SearchIcon, BellIcon, MessageIcon, SparklesIcon, UserIcon, SettingsIcon, GroupIcon, NewspaperIcon } from './icons';
import type { CurrentPage } from '../App';

interface HeaderProps {
    currentUser: User;
    onSearch: (query: string) => void;
    onNavigate: (page: CurrentPage) => void;
    onViewProfile: (userId: string) => void;
    onLogout: () => void;
    theme: { [key: string]: string };
    onToggleChatbot: () => void;
    notifications: Notification[];
    users: { [key: string]: User };
    onMarkNotificationsRead: () => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";

    return Math.floor(seconds) + "s";
};

const NotificationDropdown: React.FC<{
    notifications: Notification[],
    currentUser: User,
    users: { [key: string]: User },
    theme: { [key: string]: string },
    onNavigate: (page: CurrentPage) => void;
    closeDropdown: () => void;
}> = ({ notifications, currentUser, users, theme, onNavigate, closeDropdown }) => {
    
    const userNotifications = notifications
        .filter(n => n.recipientId === currentUser.id)
        .slice(0, 7); // Show latest 7 notifications

    const getNotificationText = (n: Notification) => {
        const actor = users[n.actorId];
        if (!actor) return null;

        switch (n.type) {
            case 'new_like':
                return <p><span className="font-bold">{actor.name}</span> curtiu sua postagem.</p>;
            case 'new_comment':
                 return <p><span className="font-bold">{actor.name}</span> comentou na sua postagem.</p>;
            case 'friend_request':
                 return <p><span className="font-bold">{actor.name}</span> enviou um pedido de amizade.</p>;
            default:
                return null;
        }
    };
    
    const handleNotificationClick = (n: Notification) => {
        if(n.type === 'friend_request') {
            onNavigate('friends');
        }
        // Could navigate to post in future: onNavigate('post', { postId: n.targetId })
        closeDropdown();
    };

    return (
        <div className={`absolute right-0 mt-2 w-80 ${theme.panelBg} rounded-md shadow-lg border ${theme.panelBorder} z-50 overflow-hidden`}>
            <div className={`p-3 border-b ${theme.panelBorder}`}>
                <h3 className={`font-bold ${theme.text}`}>Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {userNotifications.length > 0 ? (
                    userNotifications.map(n => {
                        const actor = users[n.actorId];
                        const text = getNotificationText(n);
                        if (!actor || !text) return null;
                        
                        return (
                             <button key={n.id} onClick={() => handleNotificationClick(n)} className={`w-full text-left flex items-start p-3 space-x-3 ${theme.subtleBgHover}`}>
                                {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>}
                                <img src={actor.avatarUrl} alt={actor.name} className={`w-10 h-10 rounded-full ${n.read ? 'ml-5.5' : ''}`} />
                                <div className="flex-1">
                                    <div className={`text-sm ${theme.text}`}>
                                        {text}
                                    </div>
                                    <p className={`text-xs mt-1 ${theme.subtleText}`}>{timeAgo(n.timestamp)} atrás</p>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <p className={`p-4 text-sm text-center ${theme.subtleText}`}>Você não tem notificações.</p>
                )}
            </div>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ currentUser, onSearch, onNavigate, onViewProfile, onLogout, theme, onToggleChatbot, notifications, users, onMarkNotificationsRead }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const NavButton: React.FC<{ label: string; page: CurrentPage; icon: React.ReactNode }> = ({ label, page, icon }) => (
        <button onClick={() => onNavigate(page)} className="flex flex-col items-center space-y-1 text-xs font-medium hover:text-white/80 transition-colors">
            {icon}
            <span>{label}</span>
        </button>
    );
    
    const unreadCount = notifications.filter(n => n.recipientId === currentUser.id && !n.read).length;
    
    const toggleNotifications = () => {
        if (!isNotificationsOpen) {
            onMarkNotificationsRead();
        }
        setIsNotificationsOpen(prev => !prev);
    };

    return (
        <header className={`${theme.header} ${theme.headerText} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo and Search */}
                <div className="flex items-center space-x-6">
                    <button onClick={() => onNavigate('posts')} className="text-3xl font-bold" style={{fontFamily: "'Arial Black', Gadget, sans-serif"}}>
                        OldKut
                    </button>
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar no OldKut"
                            className="bg-white/20 placeholder-white/60 rounded-full py-1.5 px-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button type="submit" className="absolute right-3">
                            <SearchIcon className="w-5 h-5 text-white/80" />
                        </button>
                    </form>
                </div>

                {/* Main Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavButton label="Início" page="posts" icon={<NewspaperIcon className="w-6 h-6" />} />
                    <NavButton label="Perfil" page="profile" icon={<UserIcon className="w-6 h-6" />} />
                    <NavButton label="Comunidades" page="communities" icon={<GroupIcon className="w-6 h-6" />} />
                </nav>

                {/* User Actions & Menu */}
                <div className="flex items-center space-x-4">
                    <button onClick={onToggleChatbot} title="OldKut Assistente" className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <SparklesIcon className="w-6 h-6" />
                    </button>
                    <button title="Recados" onClick={() => onViewProfile(currentUser.id, { initialTab: 'scraps' })} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <MessageIcon className="w-6 h-6" />
                    </button>
                    <div className="relative" ref={notificationsRef}>
                        <button onClick={toggleNotifications} title="Notificações" className="relative hover:bg-white/20 p-2 rounded-full transition-colors">
                            <BellIcon className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] ring-2 ring-white/50">{unreadCount}</span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <NotificationDropdown
                                notifications={notifications}
                                currentUser={currentUser}
                                users={users}
                                theme={theme}
                                onNavigate={onNavigate}
                                closeDropdown={() => setIsNotificationsOpen(false)}
                            />
                        )}
                    </div>
                    
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full border-2 border-white/50" />
                            <span className="hidden lg:block text-sm font-semibold">{currentUser.name.split(' ')[0]}</span>
                        </button>
                        {isMenuOpen && (
                            <div className={`absolute right-0 mt-2 w-48 ${theme.panelBg} rounded-md shadow-lg border ${theme.panelBorder} z-50`}>
                                <div className="py-1">
                                    <button onClick={() => { onViewProfile(currentUser.id); setIsMenuOpen(false); }} className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme.text} ${theme.subtleBgHover}`}>
                                        <UserIcon className={`w-4 h-4 mr-2 ${theme.subtleText}`} />
                                        Meu Perfil
                                    </button>
                                     <button onClick={() => { onNavigate('settings'); setIsMenuOpen(false); }} className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme.text} ${theme.subtleBgHover}`}>
                                        <SettingsIcon className={`w-4 h-4 mr-2 ${theme.subtleText}`} />
                                        Configurações
                                    </button>
                                    <div className={`border-t my-1 ${theme.panelBorder}`}></div>
                                    <button onClick={onLogout} className={`w-full text-left px-4 py-2 text-sm ${theme.text} ${theme.subtleBgHover}`}>
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;