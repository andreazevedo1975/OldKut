

import React, { useState } from 'react';
import type { Post, User, PostComment, LinkPreviewData } from '../types';
import { HeartIcon, MessageIcon } from './icons';

// A regex to find URLs in text content.
const URL_REGEX_DISPLAY = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

/**
 * A utility function that parses a string and returns React elements
 * with any found URLs wrapped in an anchor `<a>` tag.
 */
const renderTextWithLinks = (text: string, linkClassName: string) => {
    const parts = text.split(URL_REGEX_DISPLAY);
    const links = text.match(URL_REGEX_DISPLAY) || [];
    
    // We use React.createElement to avoid JSX syntax issues in a plain function
    return React.createElement(
        'span',
        null, // no props for the container span
        parts.map((part, index) => {
            const link = links[index];
            return [
                part, // The text part
                // If a link exists at this position, create an <a> element for it
                link ? React.createElement('a', {
                    href: link,
                    target: '_blank',
                    rel: 'noopener noreferrer', // Security best practice for external links
                    className: linkClassName,
                    key: link + index,
                    onClick: (e) => e.stopPropagation() // Prevent post clicks
                }, link) : null
            ];
        })
    );
};

/**
 * A component to display a preview card for a URL.
 */
const LinkPreviewCard: React.FC<{ data: LinkPreviewData, theme: { [key: string]: string } }> = ({ data, theme }) => (
    <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 flex border ${theme.panelBorder} rounded-lg overflow-hidden ${theme.subtleBgHover} no-underline`}
    >
        <div className="flex-shrink-0 w-24 sm:w-32 bg-gray-200">
             <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-3 flex flex-col justify-center">
            <h4 className={`font-bold text-sm leading-tight ${theme.text}`}>{data.title}</h4>
            <p className={`text-xs ${theme.subtleText} mt-1 line-clamp-2`}>{data.description}</p>
            <p className={`text-xs text-gray-500 mt-2 truncate`}>{data.url}</p>
        </div>
    </a>
);


interface PostsPageProps {
    posts: Post[];
    users: { [key: string]: User };
    currentUser: User;
    onAddPost: (content: string) => void;
    onToggleLike: (postId: number) => void;
    onAddComment: (postId: number, content: string) => void;
    onViewProfile: (userId: string) => void;
    theme: { [key: string]: string };
    onLoadMore: () => void;
    hasMorePosts: boolean;
    isFetchingPosts: boolean;
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
            <div className={`${theme.text} whitespace-pre-wrap`}>
                {renderTextWithLinks(post.content, `${theme.link} hover:underline`)}
            </div>

            {/* Link Preview */}
            {post.linkPreview && <LinkPreviewCard data={post.linkPreview} theme={theme} />}

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


const PostsPage: React.FC<PostsPageProps> = ({ posts, users, currentUser, onAddPost, onToggleLike, onAddComment, onViewProfile, theme, onLoadMore, hasMorePosts, isFetchingPosts }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <PostCreator currentUser={currentUser} onAddPost={onAddPost} theme={theme} />

            {isFetchingPosts && posts.length === 0 && (
                <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm text-center`}>
                    <p className={`${theme.subtleText}`}>Carregando posts...</p>
                </div>
            )}

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
            </div>

            {posts.length === 0 && !isFetchingPosts && (
                <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm text-center`}>
                    <p className={`${theme.subtleText}`}>Seu feed de posts está vazio.</p>
                    <p className={`${theme.subtleText} mt-1 text-sm`}>Adicione amigos para ver o que eles estão postando!</p>
                </div>
            )}

            {posts.length > 0 && (
                <div className="mt-6 text-center">
                    {hasMorePosts ? (
                        <button
                            onClick={onLoadMore}
                            disabled={isFetchingPosts}
                            className={`${theme.button} ${theme.buttonText} font-bold py-2 px-6 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-wait`}
                        >
                            {isFetchingPosts ? 'Carregando...' : 'Carregar mais posts'}
                        </button>
                    ) : (
                        <p className={`${theme.subtleText} text-sm`}>Fim do feed. Você viu tudo!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostsPage;