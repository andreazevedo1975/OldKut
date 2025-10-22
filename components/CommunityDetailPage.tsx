import React from 'react';
import type { Community, User } from '../types';
import { THEMES } from '../App';
import { UserIcon } from './icons';
import type { CurrentPage } from '../App';

interface CommunityDetailPageProps {
    community: Community;
    currentUser: User;
    onToggleCommunity: (communityId: number) => void;
    onNavigate: (page: CurrentPage) => void;
    onViewProfile: (userId: string) => void;
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ community, currentUser, onToggleCommunity, onNavigate, onViewProfile }) => {
    const communityTheme = THEMES[community.theme] || THEMES.classic;
    const isMember = currentUser.communities.includes(community.id);

    // Mock data for forum topics
    const mockTopics = [
        { id: 1, title: "Boas-vindas aos novos membros!", author: "Admin", replies: 15, lastReply: '2 horas atrás' },
        { id: 2, title: "Qual a sua melhor memória com a galera?", author: "João", replies: 42, lastReply: '5 horas atrás' },
        { id: 3, title: "Regras da comunidade e dicas de convivência", author: "Moderador", replies: 28, lastReply: '1 dia atrás' },
        { id: 4, title: "Sugestões para a nossa comunidade", author: "Maria", replies: 78, lastReply: '3 dias atrás' },
        { id: 5, title: "Tópico de Off-topic!", author: "Ana", replies: 102, lastReply: '3 dias atrás' },
    ];

    // This is a rough way to create a themed background without Tailwind supporting dynamic class construction.
    // In a real app, you might use CSS variables.
    const headerStyle = {
      backgroundColor: communityTheme.subtleBg.startsWith('bg-') ? undefined : communityTheme.subtleBg,
    };
    const headerClass = communityTheme.subtleBg.startsWith('bg-') ? communityTheme.subtleBg : '';


    return (
        <div className={`${communityTheme.panelBg} rounded-md border ${communityTheme.panelBorder} shadow-sm overflow-hidden`}>
            {/* Community Header */}
            <div className={`p-4 md:p-6 border-b ${communityTheme.panelBorder} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${headerClass}`} style={headerStyle}>
                <div className="flex items-center space-x-4">
                    <img src={community.imageUrl} alt={community.name} className="w-20 h-20 md:w-24 md:h-24 rounded-md border-2 border-white shadow-md" />
                    <div>
                        <h2 className={`text-2xl font-bold ${communityTheme.link}`}>{community.name}</h2>
                        <p className={`text-sm ${communityTheme.subtleText} flex items-center space-x-2 mt-1`}>
                            <UserIcon className="w-4 h-4" />
                            <span>{community.members.toLocaleString('pt-BR')} membros</span>
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0 self-start md:self-center">
                    <button
                        onClick={() => onToggleCommunity(community.id)}
                        className={`font-bold py-1.5 px-5 rounded-md hover:opacity-90 text-sm shadow-md ${isMember ? `bg-red-500 text-white` : `${communityTheme.button} ${communityTheme.buttonText}`}`}
                    >
                        {isMember ? 'Sair da Comunidade' : 'Participar'}
                    </button>
                </div>
            </div>

            {/* Main content - Forum */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-light ${communityTheme.text}`}>Fórum de Discussão</h3>
                    <button className={`${communityTheme.button} ${communityTheme.buttonText} font-bold py-1 px-3 rounded-md hover:opacity-90 text-xs`}>
                        Novo Tópico
                    </button>
                </div>

                {/* Topics Table */}
                <div className="overflow-x-auto">
                    <table className={`w-full text-sm text-left ${communityTheme.text}`}>
                        <thead className={`${communityTheme.subtleBg}`}>
                            <tr>
                                <th scope="col" className="px-4 py-2 font-semibold">Tópico</th>
                                <th scope="col" className="px-4 py-2 font-semibold text-center hidden md:table-cell">Respostas</th>
                                <th scope="col" className="px-4 py-2 font-semibold hidden md:table-cell">Última Resposta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTopics.map((topic, index) => (
                                <tr key={topic.id} className={`border-b ${communityTheme.panelBorder} transition-colors ${communityTheme.subtleBgHover}`}>
                                    <td className="px-4 py-3">
                                        <a href="#" className={`font-bold ${communityTheme.link} hover:underline`}>{topic.title}</a>
                                        <p className={`text-xs ${communityTheme.subtleText} mt-0.5`}>por {topic.author}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">{topic.replies}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <p className={`${communityTheme.text}`}>{topic.lastReply}</p>
                                        <p className={`text-xs ${communityTheme.subtleText}`}>por um usuário</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <button onClick={() => onNavigate('communities')} className={`text-xs ${communityTheme.link} hover:underline mt-4 block`}>
                    &larr; Voltar para todas as comunidades
                </button>
            </div>
        </div>
    );
};

export default CommunityDetailPage;
