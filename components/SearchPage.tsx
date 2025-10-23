import React, { useMemo, useState } from 'react';
import type { User, Post, Community } from '../types';
import { UserIcon, NewspaperIcon, GroupIcon, ArrowDownIcon, ArrowUpIcon } from './icons';

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
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [locationFilter, setLocationFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');

    const lowercasedQuery = query.toLowerCase();
    const lowercasedLocation = locationFilter.toLowerCase();

    const hasActiveFilters = query || locationFilter || dateFromFilter || dateToFilter;
    
    const handleClearAdvanced = () => {
        setLocationFilter('');
        setDateFromFilter('');
        setDateToFilter('');
    };

    const filteredUsers = useMemo(() => {
        if (!hasActiveFilters) return [];
        return allUsers.filter(user => {
            if (user.id === currentUser.id) return false;
            const nameMatch = lowercasedQuery ? user.name.toLowerCase().includes(lowercasedQuery) : true;
            const locationMatch = lowercasedLocation
                ? user.city.toLowerCase().includes(lowercasedLocation) || user.country.toLowerCase().includes(lowercasedLocation)
                : true;
            // Only include if it matches active filters
            return nameMatch && locationMatch;
        });
    }, [allUsers, lowercasedQuery, lowercasedLocation, currentUser.id, hasActiveFilters]);

    const filteredPosts = useMemo(() => {
        if (!hasActiveFilters) return [];
        const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
        if (fromDate) fromDate.setHours(0, 0, 0, 0); // Start of day
        const toDate = dateToFilter ? new Date(dateToFilter) : null;
        if (toDate) toDate.setHours(23, 59, 59, 999); // End of day

        return posts.filter(post => {
            const contentMatch = lowercasedQuery ? post.content.toLowerCase().includes(lowercasedQuery) : true;
            const postDate = new Date(post.timestamp);
            
            const dateMatch =
                (!fromDate || postDate >= fromDate) &&
                (!toDate || postDate <= toDate);

            return contentMatch && dateMatch;
        });
    }, [posts, lowercasedQuery, dateFromFilter, dateToFilter, hasActiveFilters]);

    const filteredCommunities = useMemo(() => {
        // Communities only filter by main query
        if (!lowercasedQuery) return [];
        return communities.filter(community => community.name.toLowerCase().includes(lowercasedQuery));
    }, [communities, lowercasedQuery]);

    const totalResults = filteredUsers.length + filteredPosts.length + filteredCommunities.length;
    
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
            <div className={`border-b ${theme.panelBorder} pb-4 mb-6`}>
                <h2 className={`text-xl font-light ${theme.subtleText}`}>
                    Resultados da busca {query && <>por: <span className={`font-semibold ${theme.text}`}>{query}</span></>}
                </h2>
                <div className="mt-4">
                     <button onClick={() => setShowAdvanced(p => !p)} className={`flex items-center space-x-1 text-sm ${theme.link} hover:underline`}>
                        <span>Filtros Avançados</span>
                        {showAdvanced ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    </button>
                    {showAdvanced && (
                        <div className={`mt-3 p-4 rounded-md ${theme.subtleBg} border ${theme.panelBorder} space-y-4`}>
                             <div>
                                <label className={`block text-sm font-semibold ${theme.subtleText} mb-1`}>Filtrar usuários por localização</label>
                                <input
                                    type="text"
                                    placeholder="Cidade ou país..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className={`w-full md:w-1/2 p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold ${theme.subtleText} mb-1`}>Filtrar posts por data</label>
                                <div className="flex flex-col md:flex-row items-center gap-2">
                                     <input
                                        type="date"
                                        value={dateFromFilter}
                                        onChange={(e) => setDateFromFilter(e.target.value)}
                                        className={`w-full md:w-auto p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                    />
                                    <span className={theme.subtleText}>até</span>
                                     <input
                                        type="date"
                                        value={dateToFilter}
                                        onChange={(e) => setDateToFilter(e.target.value)}
                                        className={`w-full md:w-auto p-2 border ${theme.panelBorder} rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme.inputBg} ${theme.text}`}
                                    />
                                </div>
                            </div>
                            <button onClick={handleClearAdvanced} className="text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-md hover:bg-gray-300">
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {!hasActiveFilters ? (
                 <div className="text-center py-12">
                    <p className={`${theme.text}`}>Use a barra de busca ou os filtros avançados para encontrar pessoas, posts e comunidades.</p>
                </div>
            ) : totalResults === 0 ? (
                <div className="text-center py-12">
                    <p className={`${theme.text}`}>Nenhum resultado encontrado para os filtros aplicados.</p>
                    <p className={`${theme.subtleText} text-sm`}>Tente usar termos de busca diferentes ou ajustar os filtros.</p>
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
                                        <p className={`text-xs ${theme.subtleText}`}>{highlightQuery(`${user.city}, ${user.country}`, locationFilter)}</p>
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

                    {/* Communities Section (only shows if main query is used) */}
                    {query && (
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
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;