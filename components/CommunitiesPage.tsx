import React, { useState, useMemo } from 'react';
import type { Community } from '../types';
import { THEMES } from '../App';
import { SearchIcon } from './icons';

interface CommunitiesPageProps {
    allCommunities: Community[];
    userCommunities: number[];
    onToggleCommunity: (communityId: number) => void;
    onViewCommunity: (communityId: number) => void;
    onCreateCommunity: (name: string, imageUrl: string, theme: string) => void;
    theme: { [key: string]: string };
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ allCommunities, userCommunities, onToggleCommunity, onViewCommunity, onCreateCommunity, theme }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState('');
    const [newCommunityImageUrl, setNewCommunityImageUrl] = useState('');
    const [newCommunityTheme, setNewCommunityTheme] = useState('classic');
    const [filterTerm, setFilterTerm] = useState('');
    const [sortOption, setSortOption] = useState('members-desc'); // e.g., 'members-desc', 'name-asc'

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommunityName.trim()) {
            onCreateCommunity(newCommunityName.trim(), newCommunityImageUrl.trim(), newCommunityTheme);
            setIsCreateModalOpen(false);
            setNewCommunityName('');
            setNewCommunityImageUrl('');
            setNewCommunityTheme('classic');
        }
    };

    const processedCommunities = useMemo(() => {
        const [criteria, direction] = sortOption.split('-');
    
        return allCommunities
            .filter(community =>
                community.name.toLowerCase().includes(filterTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (criteria === 'name') {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    if (direction === 'asc') {
                        return nameA.localeCompare(nameB);
                    } else {
                        return nameB.localeCompare(nameA);
                    }
                } else { // 'members'
                    if (direction === 'asc') {
                        return a.members - b.members;
                    } else {
                        return b.members - a.members;
                    }
                }
            });
    }, [allCommunities, filterTerm, sortOption]);

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-light ${theme.subtleText}`}>Comunidades</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm`}
                >
                    Criar Comunidade
                </button>
            </div>
            
             {/* Filter and Sort Controls */}
            <div className={`flex flex-col md:flex-row gap-4 justify-between items-center mb-6 border-y ${theme.panelBorder} py-3`}>
                <div className="relative w-full md:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Filtrar por nome..."
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                        className={`block w-full ${theme.inputBg} ${theme.text} rounded-md py-1.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-pink-500 border ${theme.panelBorder}`}
                    />
                </div>
                 <div className="flex items-center space-x-2 w-full md:w-auto">
                    <label htmlFor="sort-communities" className={`text-sm ${theme.subtleText} flex-shrink-0`}>Ordenar por:</label>
                    <select
                        id="sort-communities"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className={`p-1.5 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text} w-full`}
                    >
                        <option value="members-desc">Mais Populares</option>
                        <option value="members-asc">Menos Populares</option>
                        <option value="name-asc">Nome (A-Z)</option>
                        <option value="name-desc">Nome (Z-A)</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {processedCommunities.length > 0 ? (
                    processedCommunities.map(community => {
                        const isMember = userCommunities.includes(community.id);
                        return (
                            <div key={community.id} className={`flex items-center justify-between p-3 ${theme.subtleBg} rounded-md ${theme.subtleBgHover} transition-colors duration-200`}>
                                <div className="flex items-center space-x-4">
                                    <img src={community.imageUrl} alt={community.name} className="w-12 h-12 rounded-sm" />
                                    <div>
                                        <button onClick={() => onViewCommunity(community.id)} className={`font-bold ${theme.link} hover:underline text-left`}>{community.name}</button>
                                        <p className={`text-xs ${theme.subtleText}`}>{community.members.toLocaleString('pt-BR')} membros</p>
                                    </div>
                                </div>
                                {isMember ? (
                                    <button 
                                        onClick={() => onToggleCommunity(community.id)}
                                        className="flex items-center space-x-1 text-red-500 text-sm hover:text-red-700 font-semibold"
                                    >
                                        <span>Sair da comunidade</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => onToggleCommunity(community.id)}
                                        className={`${theme.button} ${theme.buttonText} text-xs font-bold py-1 px-3 rounded-md hover:opacity-90`}
                                    >
                                        Participar
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className={`${theme.subtleText}`}>Nenhuma comunidade encontrada com os filtros atuais.</p>
                    </div>
                )}
            </div>

            {/* Create Community Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-md border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Criar Nova Comunidade</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="communityName" className={`block text-sm font-medium ${theme.subtleText} mb-1`}>Nome da Comunidade:</label>
                                    <input 
                                        type="text"
                                        id="communityName"
                                        value={newCommunityName}
                                        onChange={(e) => setNewCommunityName(e.target.value)}
                                        className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                        placeholder="Ex: Amantes de Café"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="communityImageUrl" className={`block text-sm font-medium ${theme.subtleText} mb-1`}>URL da Imagem (Opcional):</label>
                                    <input 
                                        type="text"
                                        id="communityImageUrl"
                                        value={newCommunityImageUrl}
                                        onChange={(e) => setNewCommunityImageUrl(e.target.value)}
                                        className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                        placeholder="https://exemplo.com/imagem.png"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${theme.subtleText} mb-2`}>Tema da Comunidade:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries({classic: 'Azul', pink: 'Rosa', green: 'Verde', dark: 'Escuro'}).map(([key, name]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setNewCommunityTheme(key)}
                                                className={`flex items-center space-x-2 p-2 rounded-md border-2 transition-all text-xs ${newCommunityTheme === key ? 'border-pink-500 bg-pink-50' : `border-transparent ${theme.subtleBg}`}`}
                                            >
                                                <div className="flex -space-x-1 border border-gray-300 rounded-full p-0.5">
                                                    <span className={`block w-4 h-4 rounded-full ${THEMES[key].bg} border border-white`}></span>
                                                    <span className={`block w-4 h-4 rounded-full ${THEMES[key].header} border border-white`}></span>
                                                </div>
                                                <span className={`font-semibold ${theme.text}`}>{name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1.5 px-5 rounded-md hover:opacity-90`}
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;