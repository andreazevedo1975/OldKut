import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../types';
import { VideoIcon, XIcon, SubtitleIcon, ImageIcon } from './icons';

// Define interfaces for better type safety
interface Video {
    id: number;
    name: string;
    url: string;
    thumbnailUrl?: string;
    subtitleUrl?: string;
    subtitleName?: string;
}

interface VideoPlaylist {
    id: number;
    name: string;
    videos: Video[];
}

interface VideosPageProps {
    theme: { [key: string]: string };
    currentUser: User;
}

// Helper function to generate a thumbnail from a video file
const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
            URL.revokeObjectURL(video.src);
        };

        video.onloadedmetadata = () => {
            // Seek to the middle of the video to capture a representative frame.
            video.currentTime = video.duration / 2;
        };

        video.onseeked = () => {
            if (!context || video.videoWidth === 0) {
                cleanup();
                // If context is not available or video has no dimensions, fail gracefully.
                return resolve('');
            }
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            cleanup();
            resolve(dataUrl);
        };

        video.onerror = () => {
            cleanup();
            // If there's an error loading the video, resolve with an empty string.
            // This allows the UI to use a placeholder image.
            resolve(''); 
        };
        
        // Calling play() is necessary for some browsers to allow seeking.
        video.play().catch((error) => {
            console.error("Video play failed for thumbnail generation, but seeking might still work.", error);
            // If play() is rejected, we don't need to do anything here.
            // The `onerror` handler will catch critical video loading failures.
        });
    });
};

/**
 * Revokes all temporary object URLs associated with a video object
 * to prevent memory leaks.
 * @param video The video object.
 */
const revokeVideoUrls = (video: Video) => {
    // Revoke the main video URL created via URL.createObjectURL()
    if (video.url) URL.revokeObjectURL(video.url);
    // Revoke the thumbnail URL only if it's a temporary blob URL, not a data URL
    if (video.thumbnailUrl && video.thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(video.thumbnailUrl);
    }
    // Revoke the subtitle URL if it exists
    if (video.subtitleUrl) URL.revokeObjectURL(video.subtitleUrl);
};


const VideosPage: React.FC<VideosPageProps> = ({ theme, currentUser }) => {
    // State for playlists
    const [playlists, setPlaylists] = useState<VideoPlaylist[]>([]);
    // State to track the currently viewed playlist
    const [viewedPlaylistId, setViewedPlaylistId] = useState<number | null>(null);
    // State for the create playlist modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    // State for upload loading
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // State for delete confirmation modal
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ playlistId: number; videoId: number; videoName: string; } | null>(null);
    // State for video player modal
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

    // New states for confirmation dialogs
    const [showNavigateAwayConfirmation, setShowNavigateAwayConfirmation] = useState(false);
    const [showCreateCancelConfirmation, setShowCreateCancelConfirmation] = useState(false);
    
    // State for sorting
    const [sortCriteria, setSortCriteria] = useState<'date' | 'name'>('date');
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');


    // Handler to open the create playlist modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        setNewPlaylistName('');
    };

    // Handler to close the create playlist modal with confirmation
    const handleCloseCreateModal = () => {
        if (newPlaylistName.trim()) {
            setShowCreateCancelConfirmation(true);
        } else {
            setIsCreateModalOpen(false);
        }
    };

    const confirmCloseCreateModal = () => {
        setShowCreateCancelConfirmation(false);
        setIsCreateModalOpen(false);
        setNewPlaylistName('');
    };
    
    const cancelCloseCreateModal = () => {
        setShowCreateCancelConfirmation(false);
    };

    // Handler to create a new playlist
    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            const newPlaylist: VideoPlaylist = {
                id: Date.now(),
                name: newPlaylistName.trim(),
                videos: [],
            };
            setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
            setIsCreateModalOpen(false);
        }
    };
    
    // Handler for video upload
    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>, playlistId: number) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setIsUploading(true);

            const thumbnailUrl = await generateVideoThumbnail(file);
            const videoUrl = URL.createObjectURL(file);

            const newVideo: Video = {
                id: Date.now(),
                name: file.name,
                url: videoUrl,
                thumbnailUrl,
            };

            setPlaylists(prevPlaylists =>
                prevPlaylists.map(playlist =>
                    playlist.id === playlistId
                        ? { ...playlist, videos: [newVideo, ...playlist.videos] }
                        : playlist
                )
            );
            setIsUploading(false);
        } else {
            alert("Por favor, selecione um arquivo de vídeo válido (MP4, WEBM, OGG).");
        }
    };

    // Handler for custom thumbnail upload
    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>, playlistId: number, videoId: number) => {
        event.stopPropagation(); // Prevent modal from opening
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            if (file) {
                alert("Por favor, selecione um arquivo de imagem válido.");
            }
            return;
        }

        const newThumbnailUrl = URL.createObjectURL(file);

        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return {
                    ...p,
                    videos: p.videos.map(v => {
                        if (v.id === videoId) {
                            // Revoke old thumbnail URL if it's a blob to prevent memory leaks
                            if (v.thumbnailUrl && v.thumbnailUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(v.thumbnailUrl);
                            }
                            return { ...v, thumbnailUrl: newThumbnailUrl };
                        }
                        return v;
                    })
                };
            }
            return p;
        }));
    };

    // Handlers for video deletion
    const handleDeleteVideo = (playlistId: number, videoId: number, videoName: string) => {
        setDeleteConfirmation({ playlistId, videoId, videoName });
    };

    const confirmDeleteVideo = () => {
        if (!deleteConfirmation) return;
        const { playlistId, videoId } = deleteConfirmation;

        const playlistToUpdate = playlists.find(p => p.id === playlistId);
        const videoToDelete = playlistToUpdate?.videos.find(v => v.id === videoId);

        // Revoke object URLs for the video being deleted to prevent memory leaks.
        if (videoToDelete) {
            revokeVideoUrls(videoToDelete);
        }

        setPlaylists(prevPlaylists =>
            prevPlaylists.map(playlist =>
                playlist.id === playlistId
                    ? { ...playlist, videos: playlist.videos.filter(video => video.id !== videoId) }
                    : playlist
            )
        );
        setDeleteConfirmation(null);
    };

    const cancelDeleteVideo = () => {
        setDeleteConfirmation(null);
    };
    
    // Convert SRT to VTT format for browser compatibility
    const srt2vtt = (srtText: string): string => {
        let vttText = srtText
            .replace(/\r/g, '')
            .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
        return `WEBVTT\n\n${vttText}`;
    };

    // Handler for subtitle upload
    const handleSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>, playlistId: number, videoId: number) => {
        event.stopPropagation(); // Prevent modal from opening
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            let subtitleBlob: Blob;

            if (file.name.toLowerCase().endsWith('.srt')) {
                const vttText = srt2vtt(text);
                subtitleBlob = new Blob([vttText], { type: 'text/vtt' });
            } else {
                subtitleBlob = new Blob([text], { type: 'text/vtt' });
            }

            const subtitleUrl = URL.createObjectURL(subtitleBlob);

            setPlaylists(prev => prev.map(p => {
                if (p.id === playlistId) {
                    return {
                        ...p,
                        videos: p.videos.map(v => {
                            if (v.id === videoId) {
                                // Revoke old subtitle URL if it exists to prevent memory leaks
                                if (v.subtitleUrl) {
                                    URL.revokeObjectURL(v.subtitleUrl);
                                }
                                return { ...v, subtitleUrl, subtitleName: file.name };
                            }
                            return v;
                        })
                    };
                }
                return p;
            }));
        };
        reader.readAsText(file);
    };
    
    // New handler for navigating back from playlist view
    const handleBackToPlaylists = () => {
        if (isUploading) {
            setShowNavigateAwayConfirmation(true);
        } else {
            setViewedPlaylistId(null);
        }
    };

    const confirmNavigateAway = () => {
        setShowNavigateAwayConfirmation(false);
        setViewedPlaylistId(null);
    };
    
    const cancelNavigateAway = () => {
        setShowNavigateAwayConfirmation(false);
    };


    // Clean up object URLs to prevent memory leaks when the component unmounts.
    useEffect(() => {
        // This effect hook is crucial for preventing memory leaks.
        // It returns a cleanup function that will be executed whenever the component
        // unmounts or before the effect runs again due to dependency changes.
        return () => {
            // We iterate through all videos in all playlists and revoke their
            // associated object URLs. This ensures that if the user navigates
            // away from the page, the browser releases the memory used by these files.
            playlists.forEach(playlist => {
                playlist.videos.forEach(revokeVideoUrls);
            });
        };
    }, [playlists]);
    
    // Get the currently viewed playlist object
    const viewedPlaylist = playlists.find(playlist => playlist.id === viewedPlaylistId);

    // Memoized sorted videos
    const sortedVideos = useMemo(() => {
        if (!viewedPlaylist) return [];
        
        const videosCopy = [...viewedPlaylist.videos];

        videosCopy.sort((a, b) => {
            if (sortCriteria === 'name') {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (sortDirection === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            } else { // sort by date (using id as timestamp)
                if (sortDirection === 'asc') {
                    return a.id - b.id; // oldest first
                } else {
                    return b.id - a.id; // newest first
                }
            }
        });

        return videosCopy;
    }, [viewedPlaylist, sortCriteria, sortDirection]);

    
    // RENDER LOGIC
    
    // Playlist Detail View
    if (viewedPlaylist) {
        return (
             <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
                <button 
                    onClick={handleBackToPlaylists}
                    className={`text-sm ${theme.link} hover:underline mb-4`}
                >
                    &larr; Voltar para Playlists de Vídeos
                </button>
                <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>
                    Playlist: {viewedPlaylist.name}
                </h2>

                {/* Upload Form for this playlist */}
                <div className={`border-2 border-dashed ${theme.panelBorder} rounded-lg p-6 text-center mb-8`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>Adicionar vídeo a esta playlist</h3>
                    <p className={`text-sm ${theme.subtleText} mt-1 mb-4`}>
                        Envie seus vídeos em formato MP4, WebM ou OGG.
                    </p>
                    <input
                        type="file"
                        id="videoUpload"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e, viewedPlaylist.id)}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="videoUpload"
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

                {/* Video Gallery */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-semibold ${theme.text}`}>Vídeos nesta playlist ({sortedVideos.length})</h3>
                        <div className="flex items-center">
                            <label htmlFor="sort-videos" className={`text-sm ${theme.subtleText} mr-2`}>Ordenar por:</label>
                            <select
                                id="sort-videos"
                                value={`${sortCriteria}-${sortDirection}`}
                                onChange={(e) => {
                                    const [criteria, direction] = e.target.value.split('-');
                                    setSortCriteria(criteria as 'date' | 'name');
                                    setSortDirection(direction as 'asc' | 'desc');
                                }}
                                className={`p-1.5 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                            >
                                <option value="date-desc">Data (mais novo)</option>
                                <option value="date-asc">Data (mais antigo)</option>
                                <option value="name-asc">Nome (A-Z)</option>
                                <option value="name-desc">Nome (Z-A)</option>
                            </select>
                        </div>
                    </div>
                    {sortedVideos.length === 0 && !isUploading ? (
                        <div className="text-center py-8">
                            <p className={`${theme.subtleText}`}>Esta playlist ainda não tem vídeos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {sortedVideos.map(video => (
                                <div key={video.id} className="group relative overflow-hidden rounded-md shadow-lg bg-black cursor-pointer" onClick={() => setPlayingVideo(video)}>
                                    <img 
                                        src={video.thumbnailUrl || 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=Video'}
                                        alt={video.name}
                                        className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input
                                            type="file"
                                            id={`subtitle-upload-${video.id}`}
                                            className="hidden"
                                            accept=".vtt,.srt"
                                            onChange={(e) => handleSubtitleUpload(e, viewedPlaylist.id, video.id)}
                                        />
                                        <label
                                            htmlFor={`subtitle-upload-${video.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 bg-black bg-opacity-60 rounded-full text-white hover:bg-blue-500 cursor-pointer"
                                            title={video.subtitleName ? `Alterar legenda (${video.subtitleName})` : "Adicionar legenda"}
                                        >
                                            <SubtitleIcon className={`w-4 h-4 ${video.subtitleUrl ? 'text-cyan-400' : ''}`} />
                                        </label>
                                        <input
                                            type="file"
                                            id={`thumbnail-upload-${video.id}`}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleThumbnailUpload(e, viewedPlaylist.id, video.id)}
                                        />
                                        <label
                                            htmlFor={`thumbnail-upload-${video.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 bg-black bg-opacity-60 rounded-full text-white hover:bg-green-500 cursor-pointer"
                                            title="Alterar thumbnail"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </label>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteVideo(viewedPlaylist.id, video.id, video.name); }}
                                            className="p-1.5 bg-black bg-opacity-60 rounded-full text-white hover:bg-red-500"
                                            title="Deletar vídeo"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                     </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs">
                                        <p className="font-semibold truncate">{video.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Playlist List View (Default View)
    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
             <div className={`flex justify-between items-center mb-6 border-b ${theme.panelBorder} pb-3`}>
                 <h2 className={`text-xl font-light ${theme.subtleText}`}>
                    Meus Vídeos
                </h2>
                <button 
                    onClick={handleOpenCreateModal}
                    className={`${theme.button} ${theme.buttonText} font-bold py-1.5 px-4 rounded-md hover:opacity-90 text-sm`}
                >
                    Criar Nova Playlist
                </button>
            </div>

            {/* Playlist Grid */}
             {playlists.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`${theme.subtleText}`}>Você ainda não criou nenhuma playlist de vídeo.</p>
                    <p className={`${theme.subtleText} text-sm mt-1`}>Clique em "Criar Nova Playlist" para começar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {playlists.map(playlist => {
                        const coverThumbnail = playlist.videos[0]?.thumbnailUrl;
                        return (
                             <div key={playlist.id} className="group cursor-pointer" onClick={() => setViewedPlaylistId(playlist.id)}>
                                <div className="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                                     {coverThumbnail ? (
                                        <img 
                                            src={coverThumbnail}
                                            alt={`Capa da playlist ${playlist.name}`}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <VideoIcon className="w-16 h-16 text-gray-400" />
                                        </div>
                                     )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-2 left-3 right-3 text-white">
                                        <h3 className="font-bold truncate">{playlist.name}</h3>
                                        <p className="text-xs">{playlist.videos.length} vídeos</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            
            {/* Create Playlist Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Criar Nova Playlist de Vídeo</h3>
                        <form onSubmit={handleCreatePlaylist}>
                            <label htmlFor="playlistName" className={`block text-sm font-medium ${theme.subtleText} mb-1`}>Nome da Playlist:</label>
                            <input 
                                type="text"
                                id="playlistName"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                placeholder="Ex: Férias na Praia"
                                autoFocus
                            />
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={handleCloseCreateModal}
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
            
            {/* Video Player Modal */}
            {playingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]" onClick={() => setPlayingVideo(null)}>
                    <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setPlayingVideo(null)}
                            className="absolute -top-2 -right-2 md:-top-8 md:-right-8 text-white bg-black bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-80 transition-colors"
                            aria-label="Fechar player de vídeo"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                        <div className="bg-black p-1 rounded-lg shadow-xl">
                            <video
                                key={playingVideo.id} // Re-mount video element when video changes
                                src={playingVideo.url}
                                controls
                                autoPlay
                                crossOrigin="anonymous"
                                className="w-full max-h-[85vh] rounded"
                            >
                                {playingVideo.subtitleUrl && (
                                    <track
                                        src={playingVideo.subtitleUrl}
                                        kind="subtitles"
                                        srcLang="pt"
                                        label="Português"
                                        default
                                    />
                                )}
                            </video>
                             <h3 className="text-sm font-bold text-white mt-2 px-2 truncate">{playingVideo.name}</h3>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Confirmar Exclusão</h3>
                         <p className={`${theme.text} text-sm mb-4`}>
                            Você tem certeza que deseja excluir permanentemente o vídeo "<strong>{deleteConfirmation.videoName}</strong>"?
                            <br />
                            <span className="font-bold">Esta ação não pode ser desfeita.</span>
                        </p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                type="button" 
                                onClick={cancelDeleteVideo}
                                className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDeleteVideo}
                                className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigate Away Confirmation Modal */}
            {showNavigateAwayConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Upload em Andamento</h3>
                         <p className={`${theme.text} text-sm mb-4`}>
                            Um upload de vídeo está em andamento. Se você sair agora, o upload será cancelado.
                            <br/>
                            Tem certeza que deseja sair?
                        </p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                type="button" 
                                onClick={cancelNavigateAway}
                                className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                            >
                                Ficar na Página
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmNavigateAway}
                                className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700"
                            >
                                Sair Mesmo Assim
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Create Playlist Cancel Confirmation Modal */}
            {showCreateCancelConfirmation && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${theme.panelBg} p-6 rounded-lg shadow-xl w-full max-w-sm border ${theme.panelBorder}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Descartar Alterações?</h3>
                         <p className={`${theme.text} text-sm mb-4`}>
                            Você tem alterações não salvas. Tem certeza que deseja fechar sem criar a playlist?
                        </p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                type="button" 
                                onClick={cancelCloseCreateModal}
                                className="bg-gray-200 text-gray-800 text-sm font-bold py-1.5 px-5 rounded-md hover:bg-gray-300"
                            >
                                Continuar Editando
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmCloseCreateModal}
                                className="bg-red-600 text-white text-sm font-bold py-1.5 px-5 rounded-md hover:bg-red-700"
                            >
                                Descartar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideosPage;