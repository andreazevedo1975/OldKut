import React, { useState } from 'react';
import type { Community } from '../types';
import { CheckCircleIcon } from './icons';

interface CommunitiesPageProps {
    allCommunities: Community[];
    userCommunities: number[];
    onToggleCommunity: (communityId: number) => void;
    onViewCommunity: (communityId: number) => void;
    onCreateCommunity: (name: string, imageUrl: string) => void;
    theme: { [key: string]: string };
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ allCommunities, userCommunities, onToggleCommunity, onViewCommunity, onCreateCommunity, theme }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState('');
    const [newCommunityImageUrl, setNewCommunityImageUrl] = useState('');

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommunityName.trim()) {
            onCreateCommunity(newCommunityName.trim(), newCommunityImageUrl.trim());
            setIsCreateModalOpen(false);
            setNewCommunityName('');
            setNewCommunityImageUrl('');
        }
    };

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <div className="flex justify-between items-center mb-6 border-b ${theme.panelBorder} pb-3">
                <h2 className={`text-xl font-light ${theme.subtleText}`}>Comunidades</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm`}
                >
                    Criar Comunidade
                </button>
            </div>
            <div className="space-y-4">
                {allCommunities.map(community => {
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
                })}
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