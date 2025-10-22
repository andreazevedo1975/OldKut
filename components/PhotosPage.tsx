import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Album, Photo } from '../types';
import { FolderPlusIcon, ArrowUpTrayIcon, TrashIcon, CameraIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface PhotosPageProps {
    theme: { [key: string]: string };
    albums: Album[];
    onCreateAlbum: (name: string) => void;
    onAddPhotos: (albumId: string, photos: Photo[]) => void;
    onDeletePhoto: (albumId: string, photoId: string) => void;
}

const PhotosPage: React.FC<PhotosPageProps> = ({ theme, albums, onCreateAlbum, onAddPhotos, onDeletePhoto }) => {
    const [view, setView] = useState<'list' | 'album'>('list');
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');
    const [uploadQueue, setUploadQueue] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
    const [sortConfig, setSortConfig] = useState<{ key: 'uploadDate' | 'name'; direction: 'asc' | 'desc' }>({ key: 'uploadDate', direction: 'desc' });
    const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createdObjectURLs = useRef<string[]>([]);

    useEffect(() => {
        const processQueue = async () => {
            if (uploadQueue.length > 0 && selectedAlbumId) {
                const file = uploadQueue[0];
                setUploadProgress(prev => ({ ...prev, current: prev.total - uploadQueue.length + 1 }));

                // Simulate upload delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const objectURL = URL.createObjectURL(file);
                createdObjectURLs.current.push(objectURL);

                const newPhoto: Photo = {
                    id: `photo-${Date.now()}`,
                    url: objectURL,
                    name: file.name,
                    uploadDate: new Date().toISOString(),
                };

                onAddPhotos(selectedAlbumId, [newPhoto]);
                setUploadQueue(prev => prev.slice(1));
            } else if (uploadQueue.length === 0 && uploadProgress.total > 0) {
                 // Reset progress when queue is empty
                setUploadProgress({ current: 0, total: 0 });
            }
        };
        processQueue();
    }, [uploadQueue, onAddPhotos, selectedAlbumId, uploadProgress.total]);
    
    // Cleanup Object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            createdObjectURLs.current.forEach(URL.revokeObjectURL);
        }
    }, []);

    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAlbumName.trim()) {
            onCreateAlbum(newAlbumName.trim());
            setIsCreateModalOpen(false);
            setNewAlbumName('');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setUploadQueue(files);
            setUploadProgress({ current: 0, total: files.length });
        }
    };
    
    const handleDeleteClick = (photo: Photo) => {
        setPhotoToDelete(photo);
    };

    const confirmDelete = () => {
        if (photoToDelete && selectedAlbumId) {
            onDeletePhoto(selectedAlbumId, photoToDelete.id);
            const urlToRevoke = createdObjectURLs.current.find(url => url === photoToDelete.url);
            if(urlToRevoke) {
                URL.revokeObjectURL(urlToRevoke);
                createdObjectURLs.current = createdObjectURLs.current.filter(url => url !== urlToRevoke);
            }
        }
        setPhotoToDelete(null);
    };

    const selectedAlbum = useMemo(() => albums.find(a => a.id === selectedAlbumId), [albums, selectedAlbumId]);

    const sortedPhotos = useMemo(() => {
        if (!selectedAlbum) return [];
        const sorted = [...selectedAlbum.photos];
        sorted.sort((a, b) => {
            if (sortConfig.key === 'name') {
                return sortConfig.direction === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else { // 'uploadDate'
                return sortConfig.direction === 'asc'
                    ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
                    : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            }
        });
        return sorted;
    }, [selectedAlbum, sortConfig]);
    
    const handleSort = (key: 'uploadDate' | 'name') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const renderAlbumList = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-light ${theme.subtleText}`}>Meus Álbuns de Fotos</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm flex items-center space-x-2`}>
                    <FolderPlusIcon className="w-5 h-5" />
                    <span>Criar Álbum</span>
                </button>
            </div>
            {albums.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {albums.map(album => (
                        <button key={album.id} onClick={() => { setSelectedAlbumId(album.id); setView('album'); }} className="text-center group">
                            <div className={`relative w-full aspect-square ${theme.subtleBg} rounded-lg flex items-center justify-center border ${theme.panelBorder} group-hover:shadow-lg transition-shadow`}>
                                <FolderPlusIcon className={`w-16 h-16 ${theme.subtleText}`} />
                                {album.photos.length > 0 && (
                                    <img src={album.photos[0].url} alt="Capa do álbum" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity rounded-lg"></div>
                                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-full">{album.photos.length} fotos</span>
                            </div>
                            <p className={`mt-2 text-sm font-semibold ${theme.link} group-hover:underline`}>{album.name}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <CameraIcon className={`w-16 h-16 mx-auto ${theme.subtleText}`} />
                    <p className={`${theme.text} mt-4`}>Você ainda não criou nenhum álbum.</p>
                    <p className={`${theme.subtleText} text-sm`}>Clique em "Criar Álbum" para começar!</p>
                </div>
            )}
        </>
    );

    const renderAlbumDetail = () => {
        if (!selectedAlbum) return null;
        
        const isUploading = uploadProgress.total > 0;

        return (
            <>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <button onClick={() => setView('list')} className={`text-sm ${theme.link} hover:underline`}>&larr; Voltar para Álbuns</button>
                        <h2 className={`text-2xl font-bold ${theme.text} mt-1`}>{selectedAlbum.name}</h2>
                    </div>
                    <div>
                         <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-wait`}>
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <span>Adicionar Fotos</span>
                        </button>
                        <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    </div>
                </div>

                {isUploading && (
                    <div className={`mb-4 p-3 ${theme.subtleBg} rounded-md border ${theme.panelBorder}`}>
                        <p className={`text-sm font-semibold ${theme.text}`}>Enviando fotos... ({uploadProgress.current} de {uploadProgress.total})</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className={`${theme.button} h-2.5 rounded-full`} style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}></div>
                        </div>
                    </div>
                )}
                
                 {/* Sort controls */}
                <div className="flex justify-end items-center gap-4 mb-4">
                    <span className={`text-sm ${theme.subtleText}`}>Ordenar por:</span>
                    <button onClick={() => handleSort('uploadDate')} className={`flex items-center gap-1 text-sm ${sortConfig.key === 'uploadDate' ? theme.link : theme.subtleText} font-semibold`}>
                        Data {sortConfig.key === 'uploadDate' && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-3 h-3"/> : <ArrowDownIcon className="w-3 h-3"/>)}
                    </button>
                     <button onClick={() => handleSort('name')} className={`flex items-center gap-1 text-sm ${sortConfig.key === 'name' ? theme.link : theme.subtleText} font-semibold`}>
                        Nome {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-3 h-3"/> : <ArrowDownIcon className="w-3 h-3"/>)}
                    </button>
                </div>


                {sortedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {sortedPhotos.map(photo => (
                            <div key={photo.id} className="relative group">
                                <img src={photo.url} alt={photo.name} className={`w-full aspect-square object-cover rounded-lg border ${theme.panelBorder}`} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                                    <button onClick={() => handleDeleteClick(photo)} className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                 <p className={`text-xs ${theme.subtleText} mt-1 truncate`} title={photo.name}>{photo.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <CameraIcon className={`w-16 h-16 mx-auto ${theme.subtleText}`} />
                        <p className={`${theme.text} mt-4`}>Este álbum está vazio.</p>
                        <p className={`${theme.subtleText} text-sm`}>Clique em "Adicionar Fotos" para começar a preenchê-lo!</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            {view === 'list' ? renderAlbumList() : renderAlbumDetail()}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Criar Novo Álbum</h3>
                        <form onSubmit={handleCreateAlbum}>
                            <label htmlFor="albumName" className={`block text-sm font-medium ${theme.subtleText} mb-1`}>Nome do Álbum:</label>
                            <input type="text" id="albumName" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`} autoFocus required />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1.5 px-5 rounded-md hover:opacity-90`}>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {photoToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text}`}>Confirmar Exclusão</h3>
                        <p className={`my-4 ${theme.text} text-sm`}>Tem certeza que deseja excluir a foto "{photoToDelete.name}"? Esta ação não pode ser desfeita.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setPhotoToDelete(null)} className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={confirmDelete} className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotosPage;