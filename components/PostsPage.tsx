import React, { useState } from 'react';
import type { Post, User, PostComment } from '../types';
import { HeartIcon, MessageIcon } from './icons';

interface PostsPageProps {
    posts: Post[];
    users: { [key: string]: User };
    currentUser: User;
    onAddPost: (content: string) => void;
    onToggleLike: (postId: number) => void;
    onAddComment: (postId: number, content: string) => void;
    onViewProfile: (userId: string) => void;
    theme: { [key: string]: string };
}

const PostCreator: React.FC<{
    currentUser: User;
    onAddPost: (content: string) => void;
    theme: { [key: string]: string };
}> = ({ currentUser, onAddPost, theme }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <div className={`${theme.panelBg} p-4 rounded-md border ${theme.panelBorder} shadow-sm mb-6`}>
            <form onSubmit={handleSubmit} className="flex items-start space-x-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`No que você está pensando, ${currentUser.name.split(' ')[0]}?`}
                        className={`w-full p-2 border ${theme.panelBorder} rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1 px-5 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                            Postar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const PostCard: React.FC<{
    post: Post;
    users: { [key: string]: User };
    currentUser: User;
    onToggleLike: (postId: number) => void;
    onAddComment: (postId: number, content: string) => void;
    onViewProfile: (userId: string) => void;
    theme: { [key: string]: string };
}> = ({ post, users, currentUser, onToggleLike, onAddComment, onViewProfile, theme }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const author = users[post.authorId];
    if (!author) return null;

    const isLiked = post.likedByIds.includes(currentUser.id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className={`${theme.panelBg} p-4 rounded-md border ${theme.panelBorder} shadow-sm`}>
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-3">
                <button onClick={() => onViewProfile(author.id)}>
                    <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full" />
                </button>
                <div>
                    <button onClick={() => onViewProfile(author.id)} className={`font-bold ${theme.link} hover:underline`}>{author.name}</button>
                    <p className={`text-xs ${theme.subtleText}`}>{new Date(post.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>

            {/* Post Content */}
            <p className={`${theme.text} whitespace-pre-wrap`}>{post.content}</p>

            {/* Post Actions */}
            <div className={`flex items-center space-x-6 mt-3 pt-2 border-t ${theme.panelBorder}`}>
                <button onClick={() => onToggleLike(post.id)} className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-pink-500 font-bold' : theme.subtleText} hover:text-pink-500`}>
                    <HeartIcon filled={isLiked} className="w-4 h-4" />
                    <span>{post.likedByIds.length} {isLiked ? 'Orkutido!' : 'Orkutear'}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className={`flex items-center space-x-1 text-sm ${theme.subtleText} hover:${theme.link}`}>
                    <MessageIcon className="w-4 h-4" />
                    <span>{post.comments.length} Comentários</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className={`mt-3 pt-3 border-t ${theme.panelBorder}`}>
                    {/* Comment List */}
                    <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-2">
                        {post.comments.map(comment => {
                            const commentAuthor = users[comment.authorId];
                            if (!commentAuthor) return null;
                            return (
                                <div key={comment.id} className="flex items-start space-x-2">
                                    <button onClick={() => onViewProfile(commentAuthor.id)}>
                                        <img src={commentAuthor.avatarUrl} alt={commentAuthor.name} className="w-8 h-8 rounded-full" />
                                    </button>
                                    <div className={`flex-1 rounded-md p-2 ${theme.subtleBg}`}>
                                        <div className="flex items-baseline space-x-2">
                                            <button onClick={() => onViewProfile(commentAuthor.id)} className={`text-sm font-bold ${theme.link} hover:underline`}>{commentAuthor.name}</button>
                                            <span className={`text-xs ${theme.subtleText}`}>{new Date(comment.timestamp).toLocaleString('pt-BR')}</span>
                                        </div>
                                        <p className={`text-sm ${theme.text}`}>{comment.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {post.comments.length === 0 && <p className={`text-sm italic ${theme.subtleText}`}>Seja o primeiro a comentar!</p>}
                    </div>
                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                         <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                         <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className={`w-full p-2 border ${theme.panelBorder} rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                         />
                         <button type="submit" className={`${theme.button} ${theme.buttonText} text-xs font-bold py-1.5 px-4 rounded-full hover:opacity-90`}>
                            Enviar
                         </button>
                    </form>
                </div>
            )}
        </div>
    );
};


const PostsPage: React.FC<PostsPageProps> = ({ posts, users, currentUser, onAddPost, onToggleLike, onAddComment, onViewProfile, theme }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <PostCreator currentUser={currentUser} onAddPost={onAddPost} theme={theme} />
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        users={users}
                        currentUser={currentUser}
                        onToggleLike={onToggleLike}
                        onAddComment={onAddComment}
                        onViewProfile={onViewProfile}
                        theme={theme}
                    />
                ))}
                 {posts.length === 0 && (
                    <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm text-center`}>
                        <p className={`${theme.subtleText}`}>Seu feed de posts está vazio.</p>
                        <p className={`${theme.subtleText} mt-1 text-sm`}>Adicione amigos para ver o que eles estão postando!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostsPage;