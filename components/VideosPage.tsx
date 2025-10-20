import React from 'react';
import type { User } from '../types';

interface VideosPageProps {
    theme: { [key: string]: string };
    currentUser: User;
}

const VideosPage: React.FC<VideosPageProps> = ({ theme, currentUser }) => {
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>
                Vídeos de {currentUser.name.split(' ')[0]}
            </h2>
            
            <div className="text-center">
                 <h3 className={`text-lg font-semibold ${theme.text}`}>Página em construção</h3>
                 <p className={`${theme.subtleText} mt-2 text-sm`}>
                    Em breve, você poderá ver e compartilhar vídeos com seus amigos aqui.
                 </p>
            </div>
        </div>
    );
};

export default VideosPage;
