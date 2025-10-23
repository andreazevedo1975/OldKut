

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Playlist, Video } from '../types';
import { FolderPlusIcon, ArrowUpTrayIcon, TrashIcon, VideoIcon, PlayIcon, SubtitleIcon, ImageIcon, SearchIcon, PencilIcon } from './icons';

interface VideosPageProps {
    theme: { [key:string]: string };
    playlists: Playlist[];
    onCreatePlaylist: (name: string) => void;
    onAddVideos: (playlistId: string, videos: Video[]) => void;
    onDeleteVideo: (playlistId: string, videoId: string) => void;
    onUpdateVideo: (playlistId: string, video: Video) => void;
    onEditPlaylistName: (playlistId: string, newName: string) => void;
}

type UploadStatus = 'waiting' | 'processing' | 'completed' | 'error';
interface UploadQueueItem {
    id: number;
    file: File;
    status: UploadStatus;
}

// Utility to generate a video thumbnail
const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return reject('Canvas context not available');

        video.src = URL.createObjectURL(file);
        video.muted = true;

        video.onloadeddata = () => {
            video.currentTime = 1; // Seek to 1 second
        };

        video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            URL.revokeObjectURL(video.src);
            resolve(canvas.toDataURL('image/jpeg'));
        };

        video.onerror = (err) => {
            URL.revokeObjectURL(video.src);
            reject(err);
        };
    });
};

const VideosPage: React.FC<VideosPageProps> = ({ theme, playlists, onCreatePlaylist, onAddVideos, onDeleteVideo, onUpdateVideo, onEditPlaylistName }) => {
    const [view, setView] = useState<'list' | 'playlist'>('list');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [filterTerm, setFilterTerm] = useState('');
    const [sortOption, setSortOption] = useState('date-desc');
    const [editingPlaylist, setEditingPlaylist] = useState<{ id: string; name: string } | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createdObjectURLs = useRef<string[]>([]);
    
    // Warn user before leaving page during upload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isUploading]);

    // Process upload queue
    useEffect(() => {
        const processQueue = async () => {
            if (!isUploading || !selectedPlaylistId) return;

            const nextItem = uploadQueue.find(item => item.status === 'waiting');
            if (!nextItem) {
                // All items processed, finish upload
                if (uploadQueue.every(item => item.status === 'completed' || item.status === 'error')) {
                    setIsUploading(false);
                }
                return;
            }

            setUploadQueue(q => q.map(item => item.id === nextItem.id ? { ...item, status: 'processing' } : item));
            
            try {
                const thumbnailUrl = await generateVideoThumbnail(nextItem.file);
                const objectURL = URL.createObjectURL(nextItem.file);
                createdObjectURLs.current.push(objectURL);
                createdObjectURLs.current.push(thumbnailUrl);

                const newVideo: Video = {
                    id: `video-${nextItem.id}`,
                    url: objectURL,
                    thumbnailUrl,
                    name: nextItem.file.name,
                    uploadDate: new Date().toISOString(),
                };
                onAddVideos(selectedPlaylistId, [newVideo]);
                setUploadQueue(q => q.map(item => item.id === nextItem.id ? { ...item, status: 'completed' } : item));
            } catch (error) {
                console.error("Error processing video:", error);
                setUploadQueue(q => q.map(item => item.id === nextItem.id ? { ...item, status: 'error' } : item));
            }
        };
        processQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading, uploadQueue, selectedPlaylistId]);

    // Cleanup Object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            createdObjectURLs.current.forEach(URL.revokeObjectURL);
        }
    }, []);

    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName.trim());
            setIsCreateModalOpen(false);
            setNewPlaylistName('');
        }
    };
    
    const handleSavePlaylistName = () => {
        if(editingPlaylist && editingPlaylist.name.trim()) {
            onEditPlaylistName(editingPlaylist.id, editingPlaylist.name.trim());
        }
        setEditingPlaylist(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setUploadQueue(files.map(file => ({ id: Date.now() + Math.random(), file, status: 'waiting' })));
            setIsUploading(true);
        }
    };

    const confirmDelete = () => {
        if (videoToDelete && selectedPlaylistId) {
            onDeleteVideo(selectedPlaylistId, videoToDelete.id);
            // Fix: Revoke all associated object URLs to prevent memory leaks.
            [videoToDelete.url, videoToDelete.thumbnailUrl, videoToDelete.subtitle?.url].forEach(url => {
                if (url && url.startsWith('blob:')) { // Ensure we only revoke blob URLs
                    URL.revokeObjectURL(url);
                     createdObjectURLs.current = createdObjectURLs.current.filter(u => u !== url);
                }
            });
        }
        setVideoToDelete(null);
    };
    
    const handleThumbnailChange = (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedPlaylistId) {
            const video = selectedPlaylist?.videos.find(v => v.id === videoId);
            // Fix: Revoke the old thumbnail URL if it's a blob to prevent memory leaks.
            if(video?.thumbnailUrl && video.thumbnailUrl.startsWith('blob:')) {
                URL.revokeObjectURL(video.thumbnailUrl);
            }

            const newThumbnailUrl = URL.createObjectURL(file);
            createdObjectURLs.current.push(newThumbnailUrl);
            onUpdateVideo(selectedPlaylistId, { ...video!, thumbnailUrl: newThumbnailUrl });
        }
    };

    const handleSubtitleChange = (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedPlaylistId) {
            const video = selectedPlaylist?.videos.find(v => v.id === videoId);
            // Fix: Revoke the old subtitle URL if it's a blob to prevent memory leaks.
            if(video?.subtitle?.url && video.subtitle.url.startsWith('blob:')) {
                URL.revokeObjectURL(video.subtitle.url);
            }

            const newSubtitleUrl = URL.createObjectURL(file);
            createdObjectURLs.current.push(newSubtitleUrl);
            const subtitle = { url: newSubtitleUrl, name: file.name };
            onUpdateVideo(selectedPlaylistId, { ...video!, subtitle });
        }
    };


    const selectedPlaylist = useMemo(() => playlists.find(p => p.id === selectedPlaylistId), [playlists, selectedPlaylistId]);

    const filteredAndSortedVideos = useMemo(() => {
        if (!selectedPlaylist) return [];
        const [criteria, direction] = sortOption.split('-');

        return selectedPlaylist.videos
            .filter(video => video.name.toLowerCase().includes(filterTerm.toLowerCase()))
            .sort((a, b) => {
                if (criteria === 'name') {
                    return direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                } else { // 'date'
                    return direction === 'asc'
                        ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
                        : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                }
            });
    }, [selectedPlaylist, filterTerm, sortOption]);

    const renderPlaylistList = () => (
        <>
             <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-light ${theme.subtleText}`}>Minhas Playlists de Vídeos</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm flex items-center space-x-2`}>
                    <FolderPlusIcon className="w-5 h-5" />
                    <span>Criar Playlist</span>
                </button>
            </div>
            {playlists.length > 0 ? (
                <div className="space-y-3">
                    {playlists.map(p => (
                        <div key={p.id} className={`flex items-center p-3 rounded-lg border ${theme.panelBorder} ${theme.subtleBgHover} transition-all group`}>
                            <button onClick={() => { setSelectedPlaylistId(p.id); setView('playlist'); }} className="flex items-center flex-1 text-left">
                                <VideoIcon className={`w-10 h-10 mr-4 ${theme.subtleText}`} />
                                <div className="flex-1">
                                    <p className={`font-bold ${theme.link}`}>{p.name}</p>
                                    <p className={`text-sm ${theme.subtleText}`}>{p.videos.length} vídeo(s)</p>
                                </div>
                            </button>
                            <button onClick={() => setEditingPlaylist({id: p.id, name: p.name})} className={`p-1 ${theme.subtleText} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                     <VideoIcon className={`w-16 h-16 mx-auto ${theme.subtleText}`} />
                    <p className={`${theme.text} mt-4`}>Você ainda não criou nenhuma playlist.</p>
                </div>
            )}
        </>
    );
    
    const renderPlaylistDetail = () => {
        if (!selectedPlaylist) return null;

        return (
             <>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <button onClick={() => { setView('list'); setUploadQueue([]); setIsUploading(false); }} className={`text-sm ${theme.link} hover:underline`}>&larr; Voltar para Playlists</button>
                        <div className="flex items-center gap-2 mt-1">
                            <h2 className={`text-2xl font-bold ${theme.text}`}>{selectedPlaylist.name}</h2>
                            <button onClick={() => setEditingPlaylist({id: selectedPlaylist.id, name: selectedPlaylist.name})} className={`${theme.subtleText} hover:text-pink-500`}><PencilIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                    <div>
                         <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-wait`}>
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <span>Adicionar Vídeos</span>
                        </button>
                        <input type="file" multiple accept="video/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    </div>
                </div>

                {isUploading && (
                    <div className={`mb-4 p-3 ${theme.subtleBg} rounded-md border ${theme.panelBorder}`}>
                        <h3 className={`text-sm font-semibold ${theme.text} mb-2`}>Fila de Upload</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadQueue.map(item => (
                                <div key={item.id} className="flex items-center text-xs">
                                    <span className="truncate w-1/2" title={item.file.name}>{item.file.name}</span>
                                    <span className={`font-semibold ml-auto px-2 py-0.5 rounded-full ${
                                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                        item.status === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Filter and Sort Controls */}
                <div className={`flex flex-col md:flex-row gap-4 justify-between items-center mb-6 border-y ${theme.panelBorder} py-3`}>
                    <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-500" /></div>
                        <input type="text" placeholder="Filtrar vídeos..." value={filterTerm} onChange={e => setFilterTerm(e.target.value)} className={`block w-full ${theme.inputBg} ${theme.text} rounded-md py-1.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-pink-500 border ${theme.panelBorder}`} />
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <label className={`text-sm ${theme.subtleText} flex-shrink-0`}>Ordenar por:</label>
                        <select value={sortOption} onChange={e => setSortOption(e.target.value)} className={`p-1.5 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text} w-full`}>
                            <option value="date-desc">Mais Recentes</option>
                            <option value="date-asc">Mais Antigos</option>
                            <option value="name-asc">Nome (A-Z)</option>
                            <option value="name-desc">Nome (Z-A)</option>
                        </select>
                    </div>
                </div>

                {filteredAndSortedVideos.length > 0 ? (
                     <div className="space-y-3">
                        {filteredAndSortedVideos.map(video => (
                            <div key={video.id} className={`flex items-start gap-4 p-3 rounded-lg border ${theme.panelBorder} ${theme.subtleBg}`}>
                                <button onClick={() => setPlayingVideo(video)} className="relative flex-shrink-0 w-32 h-20 bg-black rounded-md group">
                                    <img src={video.thumbnailUrl} alt={video.name} className="w-full h-full object-cover rounded-md" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-md flex items-center justify-center">
                                        <PlayIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold ${theme.text} truncate`}>{video.name}</p>
                                    <p className={`text-xs ${theme.subtleText}`}>Enviado em: {new Date(video.uploadDate).toLocaleDateString()}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <label className={`text-xs ${theme.link} hover:underline cursor-pointer flex items-center gap-1`}>
                                            <ImageIcon className="w-3 h-3" /> Thumbnail <input type="file" accept="image/*" onChange={(e) => handleThumbnailChange(video.id, e)} className="hidden"/>
                                        </label>
                                        <label className={`text-xs ${theme.link} hover:underline cursor-pointer flex items-center gap-1`}>
                                            <SubtitleIcon className="w-3 h-3" /> {video.subtitle ? 'Trocar Legenda' : 'Add Legenda'} <input type="file" accept=".vtt,.srt" onChange={(e) => handleSubtitleChange(video.id, e)} className="hidden"/>
                                        </label>
                                    </div>
                                    {video.subtitle && <p className={`text-xs ${theme.subtleText} mt-1 italic truncate`}>Legenda: {video.subtitle.name}</p>}
                                </div>
                                <button onClick={() => setVideoToDelete(video)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                     </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <VideoIcon className={`w-16 h-16 mx-auto ${theme.subtleText}`} />
                        <p className={`${theme.text} mt-4`}>Nenhum vídeo aqui.</p>
                        <p className={`${theme.subtleText} text-sm`}>Use o botão "Adicionar Vídeos" para começar.</p>
                    </div>
                )}
            </>
        )
    };

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            {view === 'list' ? renderPlaylistList() : renderPlaylistDetail()}
            
            {/* --- MODALS --- */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Criar Nova Playlist</h3>
                        <form onSubmit={handleCreatePlaylist}>
                            <label className={`block text-sm font-medium ${theme.subtleText} mb-1`}>Nome da Playlist:</label>
                            <input type="text" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`} autoFocus required />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1.5 px-5 rounded-md hover:opacity-90`}>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
             {editingPlaylist && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Editar Nome da Playlist</h3>
                         <input type="text" value={editingPlaylist.name} onChange={(e) => setEditingPlaylist(prev => ({...prev!, name: e.target.value}))} className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`} autoFocus />
                         <div className="flex justify-end space-x-3 mt-4">
                            <button type="button" onClick={() => setEditingPlaylist(null)} className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button type="button" onClick={handleSavePlaylistName} className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1.5 px-5 rounded-md hover:opacity-90`}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}

            {videoToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text}`}>Confirmar Exclusão</h3>
                        <p className={`my-4 ${theme.text} text-sm`}>Tem certeza que deseja excluir o vídeo "{videoToDelete.name}"? Esta ação não pode ser desfeita.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setVideoToDelete(null)} className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={confirmDelete} className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
            
             {playingVideo && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPlayingVideo(null)}>
                    <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                        <video controls autoPlay className="w-full rounded-lg" key={playingVideo.id}>
                            <source src={playingVideo.url} type="video/mp4" />
                             {playingVideo.subtitle && (
                                <track
                                    label="Português"
                                    kind="subtitles"
                                    srcLang="pt"
                                    src={playingVideo.subtitle.url}
                                    default
                                />
                            )}
                            Seu navegador não suporta a tag de vídeo.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideosPage;