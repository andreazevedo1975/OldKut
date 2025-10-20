import React from 'react';
import type { Community } from '../types';

interface CommunityDetailPageProps {
    community: Community;
    theme: { [key: string]: string };
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ community, theme }) => {
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <div className="flex items-center space-x-4 mb-6 border-b pb-4 border-gray-300">
                <img src={community.imageUrl} alt={community.name} className="w-20 h-20 rounded-md" />
                <div>
                    <h2 className={`text-2xl font-bold ${theme.link}`}>{community.name}</h2>
                    <p className={`text-sm ${theme.subtleText}`}>{community.members.toLocaleString('pt-BR')} membros</p>
                </div>
            </div>
            
            <div className="text-center">
                 <h3 className={`text-lg font-semibold ${theme.text}`}>Página em construção</h3>
                 <p className={`${theme.subtleText} mt-2 text-sm`}>
                    Em breve, você poderá ver os tópicos do fórum e interagir com outros membros aqui.
                 </p>
            </div>
        </div>
    );
};

export default CommunityDetailPage;
