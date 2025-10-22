import React, { useMemo } from 'react';
import type { User, Post, Community } from '../types';
import { UserIcon, NewspaperIcon, GroupIcon } from './icons';

interface SearchPageProps {
    query: string;
    currentUser: User;
    allUsers: User[];
    usersMap: { [key: string]: User };
    posts: Post[];
    communities: Community[];
    onViewProfile: (userId: string) => void;
    onViewCommunity: (communityId: number) => void;
    theme: { [key: string]: string };
}

/**
 * A utility function that wraps matched query text in a styled element.
 */
const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    // Using a regex to split the string by the query, case-insensitively.
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <>
            {parts.map((part, i) =>
                // If the part matches the query (case-insensitively), wrap it
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="bg-pink-200 text-pink-800 font-bold px-0.5 rounded-sm">{part}</span>
                ) : (
                    part // Otherwise, just render the text part
                )
            )}
        </>
    );
};

const SearchPage: React.FC<SearchPageProps> = ({ 
    query, 
    allUsers, 
    usersMap, 
    posts, 
    communities, 
    currentUser, 
    onViewProfile, 
    onViewCommunity, 
    theme 
}) => {
    const lowercasedQuery = query.toLowerCase();

    // Memoize filtered results to avoid re-computation on every render.
    const filteredUsers = useMemo(() => {
        if (!lowercasedQuery) return [];
        return allUsers.filter(user => user.name.toLowerCase().includes(lowercasedQuery) && user.id !== currentUser.id);
    }, [allUsers, lowercasedQuery, currentUser.id]);

    const filteredPosts = useMemo(() => {
        if (!lowercasedQuery) return [];
        return posts.filter(post => post.content.toLowerCase().includes(lowercasedQuery));
    }, [posts, lowercasedQuery]);

    const filteredCommunities = useMemo(() => {
        if (!lowercasedQuery) return [];
        return communities.filter(community => community.name.toLowerCase().includes(lowercasedQuery));
    }, [communities, lowercasedQuery]);

    const totalResults = filteredUsers.length + filteredPosts.length + filteredCommunities.length;
    
    // A reusable container for each search category.
    const ResultSection: React.FC<{ title: string; count: number; icon: React.ReactNode; children: React.ReactNode }> = ({ title, count, icon, children }) => (
        <section>
            <div className={`flex items-center space-x-2 border-b ${theme.panelBorder} pb-2 mb-4`}>
                {icon}
                <h3 className={`text-lg font-semibold ${theme.text}`}>{title}</h3>
                <span className={`text-sm ${theme.subtleText}`}>({count})</span>
            </div>
            {count > 0 ? (
                <div className="space-y-3">{children}</div>
            ) : (
                <p className={`text-sm ${theme.subtleText} py-4 text-center`}>Nenhum resultado encontrado em {title.toLowerCase()}.</p>
            )}
        </section>
    );

    return (
        <div className={`${theme.panelBg} p-6 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-6`}>
                Resultados da busca por: <span className={`font-semibold ${theme.text}`}>{query}</span>
            </h2>
            
            {totalResults === 0 && !query ? (
                 <div className="text-center py-12">
                    <p className={`${theme.text}`}>Use a barra de busca no topo para encontrar pessoas, posts e comunidades.</p>
                </div>
            ) : totalResults === 0 && query ? (
                <div className="text-center py-12">
                    <p className={`${theme.text}`}>Nenhum resultado encontrado.</p>
                    <p className={`${theme.subtleText} text-sm`}>Tente usar termos de busca diferentes.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* People Section */}
                    <ResultSection title="Pessoas" count={filteredUsers.length} icon={<UserIcon className={`w-6 h-6 ${theme.text}`} />}>
                        {filteredUsers.map(user => (
                            <div key={user.id} className={`flex items-center justify-between p-2 ${theme.subtleBg} rounded-md`}>
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className={`text-sm font-bold ${theme.text}`}>{highlightQuery(user.name, query)}</p>
                                        <p className={`text-xs ${theme.subtleText}`}>{user.city}</p>
                                    </div>
                                </div>
                                <button onClick={() => onViewProfile(user.id)} className={`${theme.button} ${theme.buttonText} text-xs font-bold py-1 px-3 rounded-md hover:opacity-90`}>
                                    Ver Perfil
                                </button>
                            </div>
                        ))}
                    </ResultSection>

                    {/* Posts Section */}
                    <ResultSection title="Posts" count={filteredPosts.length} icon={<NewspaperIcon className={`w-6 h-6 ${theme.text}`} />}>
                        {filteredPosts.map(post => {
                            const author = usersMap[post.authorId];
                            if (!author) return null;
                            return (
                                <div key={post.id} className={`p-3 ${theme.subtleBg} rounded-md`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <button onClick={() => onViewProfile(author.id)} className={`text-sm font-bold ${theme.link} hover:underline`}>{author.name}</button>
                                            <p className={`text-xs ${theme.subtleText}`}>{new Date(post.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm ${theme.text} whitespace-pre-wrap`}>
                                        {highlightQuery(post.content, query)}
                                    </p>
                                </div>
                            );
                        })}
                    </ResultSection>

                    {/* Communities Section */}
                    <ResultSection title="Comunidades" count={filteredCommunities.length} icon={<GroupIcon className={`w-6 h-6 ${theme.text}`} />}>
                        {filteredCommunities.map(community => (
                             <div key={community.id} className={`flex items-center justify-between p-2 ${theme.subtleBg} rounded-md`}>
                                <div className="flex items-center space-x-3">
                                    <img src={community.imageUrl} alt={community.name} className="w-10 h-10 rounded-sm" />
                                    <div>
                                        <p className={`text-sm font-bold ${theme.text}`}>{highlightQuery(community.name, query)}</p>
                                        <p className={`text-xs ${theme.subtleText}`}>{community.members.toLocaleString()} membros</p>
                                    </div>
                                </div>
                                <button onClick={() => onViewCommunity(community.id)} className={`${theme.button} ${theme.buttonText} text-xs font-bold py-1 px-3 rounded-md hover:opacity-90`}>
                                    Ver Comunidade
                                </button>
                            </div>
                        ))}
                    </ResultSection>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
