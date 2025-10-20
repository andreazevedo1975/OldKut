import React, { useState } from 'react';
import type { User } from '../types';
import { SearchIcon, PaletteIcon } from './icons';
import { THEMES } from '../App';

interface HeaderProps {
    currentUser: User;
    onNavigate: (page: 'profile' | 'friends' | 'communities' | 'posts') => void;
    onViewProfile: (userId: number) => void;
    pendingRequestsCount: number;
    allUsers: User[];
    onLogout: () => void;
    onThemeChange: (themeKey: string) => void;
    theme: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onViewProfile, pendingRequestsCount, allUsers, onLogout, onThemeChange, theme }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim()) {
            const results = allUsers.filter(user =>
                user.name.toLowerCase().includes(term.toLowerCase()) && user.id !== currentUser.id
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleProfileClick = (userId: number) => {
        setSearchTerm('');
        setSearchResults([]);
        onViewProfile(userId);
    };

    const handleSelectTheme = (themeKey: string) => {
        onThemeChange(themeKey);
        setIsThemeMenuOpen(false);
    };
    
    return (
        <header className={`${theme.header} ${theme.headerText} shadow-md`}>
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <h1 className="text-2xl font-bold">OldKut</h1>
                
                <div className="relative flex-grow max-w-lg mx-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar no OldKut..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setSearchResults([]), 200)}
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
                        <button onClick={() => onNavigate('profile')} className="hover:opacity-80">Início</button>
                        <button onClick={() => onNavigate('posts')} className="hover:opacity-80">Posts</button>
                        <button onClick={() => onNavigate('friends')} className="relative hover:opacity-80">
                            Amigos
                            {pendingRequestsCount > 0 && (
                                <span className="absolute -top-1 -right-3 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {pendingRequestsCount}
                                </span>
                            )}
                        </button>
                        <button onClick={() => onNavigate('communities')} className="hover:opacity-80">Comunidades</button>
                    </nav>
                    <div className="flex items-center space-x-4 ml-6">
                        <div className="flex items-center space-x-2">
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full" />
                            <span className="text-sm">{currentUser.name}</span>
                        </div>
                         <div className="relative">
                            <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="hover:opacity-80">
                                <PaletteIcon className="w-5 h-5" />
                            </button>
                            {isThemeMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20" onMouseLeave={() => setIsThemeMenuOpen(false)}>
                                    <div className={`p-2 text-xs font-bold ${theme.panelBorder} border-b text-gray-500`}>
                                        Mudar o tema
                                    </div>
                                    <ul className="py-1">
                                        {Object.entries({classic: 'Azul Clássico', pink: 'Rosa Vibrante', green: 'Verde Sereno', dark: 'Modo Escuro'}).map(([key, name]) => (
                                            <li key={key}>
                                                <button
                                                    onClick={() => handleSelectTheme(key)}
                                                    className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <div className="flex -space-x-1.5 border border-gray-300 rounded-full">
                                                        <span className={`block w-4 h-4 rounded-l-full ${THEMES[key].bg}`}></span>
                                                        <span className={`block w-4 h-4 rounded-r-full ${THEMES[key].header}`}></span>
                                                    </div>
                                                    <span>{name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button onClick={onLogout} className="text-xs opacity-70 hover:underline">Sair</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;