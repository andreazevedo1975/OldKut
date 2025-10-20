import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface Comment {
    id: number;
    authorId: number;
    authorName: string;
    authorAvatar: string;
    text: string;
}

interface Video {
    id: number;
    name: string;
    url: string;
    type: string;
    comments: Comment[];
}

interface VideosPageProps {
    theme: { [key: string]: string };
    currentUser: User;
}

const CommentForm: React.FC<{
    videoId: number;
    onAddComment: (videoId: number, text: string) => void;
    theme: { [key: string]: string };
    currentUser: User;
}> = ({ videoId, onAddComment, theme, currentUser }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAddComment(videoId, text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 flex items-start space-x-2">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Adicionar um comentário..."
                    className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                    rows={1}
                    onFocus={e => e.target.rows = 2}
                    onBlur={e => { if (!text) e.target.rows = 1 }}
                />
                {text && (
                    <button
                        type="submit"
                        className={`mt-2 ${theme.button} ${theme.buttonText} text-xs font-bold py-1 px-3 rounded-md hover:opacity-90 float-right transition-all`}
                    >
                        Comentar
                    </button>
                )}
            </div>
        </form>
    );
};


const VideosPage: React.FC<VideosPageProps> = ({ theme, currentUser }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setIsUploading(true);

            const videoUrl = URL.createObjectURL(file);
            const newVideo: Video = {
                id: Date.now(),
                name: file.name,
                url: videoUrl,
                type: file.type,
                comments: [],
            };

            // Simulate upload time for better UX
            setTimeout(() => {
                setVideos(prevVideos => [newVideo, ...prevVideos]);
                setIsUploading(false);
            }, 1500);
        } else {
            alert("Por favor, selecione um arquivo de vídeo válido.");
        }
    };
    
    const handleAddComment = (videoId: number, commentText: string) => {
        if (!commentText.trim() || !currentUser) return;

        const newComment: Comment = {
            id: Date.now(),
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorAvatar: currentUser.avatarUrl,
            text: commentText,
        };

        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId
                    ? { ...video, comments: [...video.comments, newComment] }
                    : video
            )
        );
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            videos.forEach(video => URL.revokeObjectURL(video.url));
        };
    }, [videos]);

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-6 border-b ${theme.panelBorder} pb-3`}>
                Galeria de Vídeos
            </h2>

            {/* Upload Form */}
            <div className={`border-2 border-dashed ${theme.panelBorder} rounded-lg p-6 text-center mb-8`}>
                <h3 className={`text-lg font-semibold ${theme.text}`}>Adicionar novo vídeo</h3>
                <p className={`text-sm ${theme.subtleText} mt-1 mb-4`}>
                    Envie seus vídeos em formato MP4, MOV ou WebM.
                </p>
                <input
                    type="file"
                    id="videoUpload"
                    className="hidden"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoUpload}
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
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Meus Vídeos ({videos.length})</h3>
                {videos.length === 0 && !isUploading ? (
                    <div className="text-center py-8">
                        <p className={`${theme.subtleText}`}>Você ainda não adicionou nenhum vídeo.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className={`${theme.subtleBg} rounded-lg overflow-hidden border ${theme.panelBorder} shadow-md transition-shadow hover:shadow-xl flex flex-col`}>
                                <video controls className="w-full h-48 bg-black">
                                    <source src={video.url} type={video.type} />
                                    Seu navegador não suporta a tag de vídeo.
                                </video>
                                <div className="p-3">
                                    <p className={`text-sm ${theme.text} font-semibold truncate`} title={video.name}>
                                        {video.name}
                                    </p>
                                </div>
                                <div className={`p-3 border-t ${theme.panelBorder} mt-auto`}>
                                    <h4 className={`text-xs font-semibold ${theme.subtleText} mb-2`}>Comentários ({video.comments.length})</h4>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 mb-2">
                                        {video.comments.length > 0 ? video.comments.map(comment => (
                                            <div key={comment.id} className="flex items-start space-x-2">
                                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full mt-0.5 flex-shrink-0" />
                                                <div className={`flex-1 ${theme.subtleBg} rounded-lg p-2`}>
                                                    <p className={`text-xs font-bold ${theme.text}`}>{comment.authorName}</p>
                                                    <p className={`text-sm ${theme.text} break-words`}>{comment.text}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className={`text-xs ${theme.subtleText} italic`}>Nenhum comentário ainda.</p>
                                        )}
                                    </div>
                                    <CommentForm videoId={video.id} onAddComment={handleAddComment} theme={theme} currentUser={currentUser} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideosPage;