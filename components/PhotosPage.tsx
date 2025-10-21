
import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

// Define interfaces for better type safety
interface Photo {
    id: number;
    name: string;
    url: string;
}

interface Album {
    id: number;
    name: string;
    photos: Photo[];
}

interface PhotosPageProps {
    theme: { [key: string]: string };
}

const PhotosPage: React.FC<PhotosPageProps> = ({ theme }) => {
    // State for albums
    const [albums, setAlbums] = useState<Album[]>([]);
    // State to track the currently viewed album
    const [viewedAlbumId, setViewedAlbumId] = useState<number | null>(null);
    // State for the create album modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');
    // State for upload loading
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // State for delete confirmation modal
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ albumId: number; photoId: number; photoName: string; } | null>(null);

    // Handler to open the create album modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        setNewAlbumName('');
    };

    // Handler to create a new album
    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAlbumName.trim()) {
            const newAlbum: Album = {
                id: Date.now(),
                name: newAlbumName.trim(),
                photos: [],
            };
            setAlbums(prevAlbums => [newAlbum, ...prevAlbums]);
            setIsCreateModalOpen(false);
        }
    };
    
    // Handler for photo upload
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, albumId: number) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setIsUploading(true);

            const photoUrl = URL.createObjectURL(file);
            const newPhoto: Photo = {
                id: Date.now(),
                name: file.name,
                url: photoUrl,
            };

            // Simulate upload time
            setTimeout(() => {
                setAlbums(prevAlbums =>
                    prevAlbums.map(album =>
                        album.id === albumId
                            ? { ...album, photos: [newPhoto, ...album.photos] }
                            : album
                    )
                );
                setIsUploading(false);
            }, 1000);
        } else {
            alert("Por favor, selecione um arquivo de imagem válido (JPG, PNG, GIF).");
        }
    };

    // Handlers for photo deletion
    const handleDeletePhoto = (e: React.MouseEvent, albumId: number, photoId: number, photoName: string) => {
        e.stopPropagation();
        setDeleteConfirmation({ albumId, photoId, photoName });
    };

    const confirmDeletePhoto = () => {
        if (!deleteConfirmation) return;
        const { albumId, photoId } = deleteConfirmation;

        // Find the photo and revoke its URL to prevent memory leaks
        const albumToUpdate = albums.find(a => a.id === albumId);
        const photoToDelete = albumToUpdate?.photos.find(p => p.id === photoId);
        if (photoToDelete) {
            URL.revokeObjectURL(photoToDelete.url);
        }

        setAlbums(prevAlbums =>
            prevAlbums.map(album =>
                album.id === albumId
                    ? { ...album, photos: album.photos.filter(photo => photo.id !== photoId) }
                    : album
            )
        );
        setDeleteConfirmation(null);
    };

    const cancelDeletePhoto = () => {
        setDeleteConfirmation(null);
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            albums.forEach(album => {
                album.photos.forEach(photo => URL.revokeObjectURL(photo.url));
            });
        };
    }, [albums]);
    
    // Get the currently viewed album object
    const viewedAlbum = albums.find(album => album.id === viewedAlbumId);
    
    // RENDER LOGIC
    
    // Album Detail View
    if (viewedAlbum) {
        return (
             <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
                <button 
                    onClick={() => setViewedAlbumId(null)}
                    className={`text-sm ${theme.link} hover:underline mb-4`}
                >
                    &larr; Voltar para Álbuns
                </button>
                <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>
                    Álbum: {viewedAlbum.name}
                </h2>

                {/* Upload Form for this album */}
                <div className={`border-2 border-dashed ${theme.panelBorder} rounded-lg p-6 text-center mb-8`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>Adicionar foto a este álbum</h3>
                    <p className={`text-sm ${theme.subtleText} mt-1 mb-4`}>
                        Envie suas fotos em formato JPG, PNG ou GIF.
                    </p>
                    <input
                        type="file"
                        id="photoUpload"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => handlePhotoUpload(e, viewedAlbum.id)}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="photoUpload"
                        className={`cursor-pointer inline-block ${isUploading ? 'bg-gray-400 cursor-not-allowed' : theme.button} ${theme.buttonText} font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity`}
                    >
                        {isUploading ? 'Enviando...' : 'Escolher Arquivo'}
                    </label>
                    {isUploading && (
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-pink-500 h-1.5 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Photo Gallery */}
                <div>
                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Fotos neste álbum ({viewedAlbum.photos.length})</h3>
                    {viewedAlbum.photos.length === 0 && !isUploading ? (
                        <div className="text-center py-8">
                            <p className={`${theme.subtleText}`}>Este álbum ainda não tem fotos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {viewedAlbum.photos.map(photo => (
                                <div key={photo.id} className="group relative overflow-hidden rounded-md shadow-lg">
                                    <img 
                                        src={photo.url} 
                                        alt={photo.name} 
                                        className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDeletePhoto(e, viewedAlbum.id, photo.id, photo.name)}
                                            className="p-1.5 bg-black bg-opacity-60 rounded-full text-white hover:bg-red-500"
                                            title="Deletar foto"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                                        {photo.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Album List View (Default View)
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
             <div className="flex justify-between items-center mb-6 border-b ${theme.panelBorder} pb-3">
                 <h2 className={`text-xl font-light ${theme.subtleText}`}>
                    Meus Álbuns
                </h2>
                <button 
                    onClick={handleOpenCreateModal}
                    className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm`}
                >
                    Criar Novo Álbum
                </button>
            </div>

            {/* Album Grid */}
             {albums.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`${theme.subtleText}`}>Você ainda não criou nenhum álbum.</p>
                    <p className={`${theme.subtleText} text-sm mt-1`}>Clique em "Criar Novo Álbum" para começar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {albums.map(album => {
                        const coverPhoto = album.photos[0]?.url || 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=OldKut';
                        return (
                             <div key={album.id} className="group cursor-pointer" onClick={() => setViewedAlbumId(album.id)}>
                                <div className="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                                     <img 
                                        src={coverPhoto} 
                                        alt={`Capa do álbum ${album.name}`}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-2 left-3 right-3 text-white">
                                        <h3 className="font-bold truncate">{album.name}</h3>
                                        <p className="text-xs">{album.photos.length} fotos</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            
            {/* Create Album Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Criar Novo Álbum</h3>
                        <form onSubmit={handleCreateAlbum}>
                            <label htmlFor="albumName" className={`block text-sm font-medium ${theme.subtleText} mb-1`}>Nome do Álbum:</label>
                            <input 
                                type="text"
                                id="albumName"
                                value={newAlbumName}
                                onChange={(e) => setNewAlbumName(e.target.value)}
                                className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                placeholder="Ex: Viagem de Férias"
                                autoFocus
                            />
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

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Confirmar Exclusão</h3>
                        <p className={`${theme.text} text-sm mb-4`}>
                            Você tem certeza que deseja excluir permanentemente a foto "<strong>{deleteConfirmation.photoName}</strong>"?
                        </p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                type="button" 
                                onClick={cancelDeletePhoto}
                                className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDeletePhoto}
                                className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotosPage;
