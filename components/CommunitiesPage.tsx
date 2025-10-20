import React from 'react';
import type { Community } from '../types';
import { CheckCircleIcon } from './icons';

interface CommunitiesPageProps {
    allCommunities: Community[];
    userCommunities: number[];
    onToggleCommunity: (communityId: number) => void;
    onViewCommunity: (communityId: number) => void;
    theme: { [key: string]: string };
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ allCommunities, userCommunities, onToggleCommunity, onViewCommunity, theme }) => {
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>Comunidades</h2>
            <div className="space-y-4">
                {allCommunities.map(community => {
                    const isMember = userCommunities.includes(community.id);
                    return (
                        <div key={community.id} className={`flex items-center justify-between p-3 ${theme.bg === 'bg-gray-800' ? 'bg-gray-700' : 'bg-gray-50'} rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200`}>
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
        </div>
    );
};

export default CommunitiesPage;