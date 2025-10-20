import React from 'react';

interface PhotosPageProps {
    theme: { [key: string]: string };
}

const PhotosPage: React.FC<PhotosPageProps> = ({ theme }) => {
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm text-center`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-4`}>
                Álbum de Fotos
            </h2>
            <p className={`${theme.text}`}>
                Esta página está em construção.
            </p>
            <p className={`${theme.subtleText} mt-2 text-sm`}>
                Em breve, você poderá ver e gerenciar seus álbuns de fotos aqui.
            </p>
        </div>
    );
};

export default PhotosPage;
