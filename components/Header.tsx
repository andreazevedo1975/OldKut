
import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
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
}

const Header: React.FC<HeaderProps> = ({ currentUser, onSearch, onNavigate, onViewProfile, onLogout, theme, onToggleChatbot }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
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
                     <button title="Notificações (Em breve)" className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-not-allowed">
                        <BellIcon className="w-6 h-6" />
                    </button>
                    
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
