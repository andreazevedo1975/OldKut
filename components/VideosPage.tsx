import React from 'react';

interface VideosPageProps {
    theme: { [key: string]: string };
}

const VideosPage: React.FC<VideosPageProps> = ({ theme }) => {
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm text-center`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-4`}>
                Galeria de Vídeos
            </h2>
            <p className={`${theme.text}`}>
                Esta página está em construção.
            </p>
            <p className={`${theme.subtleText} mt-2 text-sm`}>
                Em breve, você poderá ver e gerenciar seus vídeos aqui.
            </p>
        </div>
    );
};

export default VideosPage;
