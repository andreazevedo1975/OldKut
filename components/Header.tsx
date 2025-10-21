import React, { useState } from 'react';
import type { User } from '../types';
import { SearchIcon } from './icons';

interface HeaderProps {
    currentUser: User;
    onNavigate: (page: 'profile' | 'friends' | 'communities' | 'posts') => void;
    onViewProfile: (userId: string) => void;
    pendingRequestsCount: number;
    allUsers: User[];
    onLogout: () => void;
    theme: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onViewProfile, pendingRequestsCount, allUsers, onLogout, theme }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

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
                        <button onClick={() => onNavigate('friends')} className="relative hover:opacity-80">
                            Amigos
                            {pendingRequestsCount > 0 && (
                                <span className="absolute -top-1 -right-3 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {pendingRequestsCount}
                                </span>
                            )}
                        </button>
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
