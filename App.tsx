
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// Import types
import type { User, Scrap, Testimonial, Community, Post, ChatMessage, Album, Photo, Video, Playlist, ProfileVisit, LinkPreviewData } from './types';

// Import components
import Header from './components/Header';
import ProfileSidebar from './components/ProfileSidebar';
import MainContent from './components/MainContent';
import FriendsPage from './components/FriendsPage';
import CommunitiesPage from './components/CommunitiesPage';
import CommunityDetailPage from './components/CommunityDetailPage';
import PostsPage from './components/PostsPage';
import PhotosPage from './components/PhotosPage';
import VideosPage from './components/VideosPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import SearchPage from './components/SearchPage';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import Chatbot from './components/Chatbot';

import { MOCK_USERS, MOCK_SCRAPS, MOCK_TESTIMONIALS, MOCK_COMMUNITIES, MOCK_POSTS, MOCK_CHAT_MESSAGES, MOCK_ALBUMS, MOCK_PLAYLISTS, MOCK_PROFILE_VISITS } from './mockData';

// Fix: Export types and constants to be used across the application. This resolves module import errors in other components.
export type CurrentPage = 'login' | 'profile' | 'posts' | 'friends' | 'communities' | 'communityDetail' | 'photos' | 'videos' | 'settings' | 'search';
export type ActiveTab = 'scraps' | 'testimonials';

export const THEMES: { [key: string]: { [key: string]: string } } = {
    classic: {
        bg: 'bg-[#D4E4F7]',
        panelBg: 'bg-white',
        panelBorder: 'border-gray-200',
        header: 'bg-[#3366CC]',
        headerText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-gray-500',
        link: 'text-[#3366CC]',
        button: 'bg-[#3366CC]',
        buttonText: 'text-white',
        inputBg: 'bg-white',
        subtleBg: 'bg-gray-100',
        subtleBgHover: 'hover:bg-gray-200',
    },
    pink: {
        bg: 'bg-pink-50',
        panelBg: 'bg-white',
        panelBorder: 'border-pink-200',
        header: 'bg-[#ED008C]',
        headerText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-pink-900 opacity-70',
        link: 'text-[#ED008C]',
        button: 'bg-[#ED008C]',
        buttonText: 'text-white',
        inputBg: 'bg-white',
        subtleBg: 'bg-pink-100',
        subtleBgHover: 'hover:bg-pink-200',
    },
    green: {
        bg: 'bg-green-50',
        panelBg: 'bg-white',
        panelBorder: 'border-green-200',
        header: 'bg-green-700',
        headerText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-green-900 opacity-70',
        link: 'text-green-700',
        button: 'bg-green-700',
        buttonText: 'text-white',
        inputBg: 'bg-white',
        subtleBg: 'bg-green-100',
        subtleBgHover: 'hover:bg-green-200',
    },
    dark: {
        bg: 'bg-gray-800',
        panelBg: 'bg-gray-900',
        panelBorder: 'border-gray-700',
        header: 'bg-gray-900 border-b border-gray-700',
        headerText: 'text-white',
        text: 'text-gray-200',
        subtleText: 'text-gray-400',
        link: 'text-cyan-400',
        button: 'bg-cyan-500',
        buttonText: 'text-white',
        inputBg: 'bg-gray-800',
        subtleBg: 'bg-gray-800',
        subtleBgHover: 'hover:bg-gray-700',
    },
};

// A simple URL matcher
const URL_REGEX = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;

// Mock function to simulate fetching link metadata
const fetchLinkPreview = async (url: string): Promise<LinkPreviewData | null> => {
    // In a real app, this would be a backend call to scrape the URL
    console.log(`Fetching preview for: ${url}`);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    try {
        // For demonstration, we'll return some mock data for a known URL
        if (url.includes('youtube.com')) {
            return {
                url,
                title: 'YouTube: Build a Fullstack App with...',
                description: 'In this tutorial, you will learn how to build a modern full-stack application from scratch using the most popular technologies.',
                image: 'https://picsum.photos/seed/youtube/400/300'
            };
        }
        return {
            url,
            title: `Website at ${new URL(url).hostname}`,
            description: 'This is a placeholder description for the linked website. Click to visit.',
            image: `https://picsum.photos/seed/${new URL(url).hostname}/400/300`
        };
    } catch {
        return null;
    }
};


const App: React.FC = () => {
    // Auth & App State
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<CurrentPage>('posts');

    // Data State
    const [users, setUsers] = useState<{ [key: string]: User }>(MOCK_USERS);
    const [scraps, setScraps] = useState<Scrap[]>(MOCK_SCRAPS);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
    const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);
    const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
    const [profileVisits, setProfileVisits] = useState<ProfileVisit[]>(MOCK_PROFILE_VISITS);

    // Page-specific state
    const [viewedUserId, setViewedUserId] = useState<string | null>(null);
    const [viewedCommunityId, setViewedCommunityId] = useState<number | null>(null);
    const [initialProfileTab, setInitialProfileTab] = useState<ActiveTab | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI State
    const [openChatWindows, setOpenChatWindows] = useState<string[]>([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [focusedChat, setFocusedChat] = useState<string | null>(null);
    
    // Auth Effect
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // On initial load, if there's a session, assume user-1 is logged in for this mock app
            if (session) {
                setCurrentUser(users['user-1']);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            // If user logs in/out, update the current user
            if (session) {
                 setCurrentUser(users['user-1']);
                 setCurrentPage('posts');
            } else {
                setCurrentUser(null);
                setCurrentPage('login');
            }
        });

        return () => subscription.unsubscribe();
    }, [users]);
    
    // Profile Visit Logger
    useEffect(() => {
        if(currentUser && viewedUserId && currentUser.id !== viewedUserId) {
            const newVisit: ProfileVisit = {
                visitorId: currentUser.id,
                visitedId: viewedUserId,
                timestamp: new Date().toISOString()
            };
            setProfileVisits(prev => [newVisit, ...prev.filter(v => v.visitorId !== currentUser.id || v.visitedId !== viewedUserId)]);
        }
    }, [currentUser, viewedUserId]);
    
    // --- Handlers ---
    const handleNavigate = useCallback((page: CurrentPage) => {
        setCurrentPage(page);
        if (page !== 'profile') setViewedUserId(null);
        if (page !== 'communityDetail') setViewedCommunityId(null);
        if (page !== 'search') setSearchQuery('');
    }, []);

    const handleViewProfile = useCallback((userId: string, options?: { initialTab?: ActiveTab }) => {
        setViewedUserId(userId);
        setCurrentPage('profile');
        if (options?.initialTab) {
            setInitialProfileTab(options.initialTab);
        }
    }, []);
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleUpdateProfile = useCallback((updatedData: Partial<User>, navigateOnSuccess = true) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        setUsers(prev => ({ ...prev, [currentUser.id]: updatedUser }));
        if (navigateOnSuccess) {
            handleViewProfile(currentUser.id);
        }
    }, [currentUser, handleViewProfile]);

    const handleAddPost = useCallback(async (content: string) => {
        if (!currentUser) return;
        const newPost: Post = {
            id: Date.now(),
            authorId: currentUser.id,
            content,
            timestamp: new Date().toISOString(),
            likedByIds: [],
            comments: [],
            linkPreview: null
        };
        const urlMatch = content.match(URL_REGEX);
        if(urlMatch) {
            const preview = await fetchLinkPreview(urlMatch[0]);
            newPost.linkPreview = preview;
        }
        setPosts(prev => [newPost, ...prev]);
    }, [currentUser]);

    const handleToggleLike = useCallback((postId: number) => {
        if (!currentUser) return;
        setPosts(posts => posts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likedByIds.includes(currentUser.id);
                return {
                    ...p,
                    likedByIds: isLiked
                        ? p.likedByIds.filter(id => id !== currentUser.id)
                        : [...p.likedByIds, currentUser.id]
                };
            }
            return p;
        }));
    }, [currentUser]);

    const handleAddComment = useCallback((postId: number, content: string) => {
        if (!currentUser) return;
        setPosts(posts => posts.map(p => {
            if (p.id === postId) {
                const newComment = {
                    id: Date.now(),
                    authorId: currentUser.id,
                    content,
                    timestamp: new Date().toISOString()
                };
                return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
        }));
    }, [currentUser]);
    
    // --- Render Logic ---
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session || !currentUser) return <LoginPage />;
    
    const currentTheme = THEMES[currentUser.theme] || THEMES.classic;
    const userForProfilePage = viewedUserId ? users[viewedUserId] : currentUser;

    const renderPage = () => {
        if(!userForProfilePage) {
            return <div>User not found. <button onClick={() => handleNavigate('posts')}>Go Home</button></div>
        }
        switch (currentPage) {
            case 'profile':
                return <MainContent
                    currentUser={currentUser}
                    viewedUser={userForProfilePage}
                    users={users}
                    scraps={scraps.filter(s => s.recipientId === userForProfilePage.id)}
                    testimonials={testimonials.filter(t => t.recipientId === userForProfilePage.id)}
                    communities={communities.filter(c => userForProfilePage.communities.includes(c.id))}
                    recentVisitors={Array.from(new Set(profileVisits.filter(v => v.visitedId === userForProfilePage.id).map(v => v.visitorId))).slice(0,6).map(id => users[id])}
                    addScrap={(content) => currentUser && setScraps(prev => [{ id: Date.now(), authorId: currentUser.id, recipientId: userForProfilePage.id, content, timestamp: 'agora', orkutedByIds: [] }, ...prev])}
                    addTestimonial={(content) => currentUser && setTestimonials(prev => [{ id: Date.now(), authorId: currentUser.id, recipientId: userForProfilePage.id, content, approved: false, orkutedByIds: [] }, ...prev])}
                    approveTestimonial={(id) => setTestimonials(prev => prev.map(t => t.id === id ? {...t, approved: true} : t))}
                    rejectTestimonial={(id) => setTestimonials(prev => prev.filter(t => t.id !== id))}
                    onViewProfile={handleViewProfile}
                    onNavigate={handleNavigate}
                    onViewCommunity={(id) => { setViewedCommunityId(id); setCurrentPage('communityDetail'); }}
                    onToggleOrkutear={(itemId, itemType) => {
                        if (itemType === 'scrap') {
                            setScraps(prev => prev.map(s => s.id === itemId ? {...s, orkutedByIds: s.orkutedByIds.includes(currentUser.id) ? s.orkutedByIds.filter(uid => uid !== currentUser.id) : [...s.orkutedByIds, currentUser.id]} : s));
                        } else {
                            setTestimonials(prev => prev.map(t => t.id === itemId ? {...t, orkutedByIds: t.orkutedByIds.includes(currentUser.id) ? t.orkutedByIds.filter(uid => uid !== currentUser.id) : [...t.orkutedByIds, currentUser.id]} : t));
                        }
                    }}
                    onSendFriendRequest={(recipientId) => {
                        setCurrentUser(u => ({...u!, sentRequests: [...u!.sentRequests, recipientId]}));
                        setUsers(prev => ({...prev, [recipientId]: {...prev[recipientId], friendRequests: [...prev[recipientId].friendRequests, currentUser.id]}}));
                    }}
                    onBlockUser={(userId) => setCurrentUser(u => ({...u!, blockedUserIds: [...u!.blockedUserIds, userId]}))}
                    onUnblockUser={(userId) => setCurrentUser(u => ({...u!, blockedUserIds: u!.blockedUserIds.filter(id => id !== userId)}))}
                    theme={currentTheme}
                    initialProfileTab={initialProfileTab}
                    onClearInitialTab={() => setInitialProfileTab(null)}
                />;
            case 'posts':
                 return <PostsPage 
                    posts={posts} 
                    users={users} 
                    currentUser={currentUser}
                    onAddPost={handleAddPost}
                    onToggleLike={handleToggleLike}
                    onAddComment={handleAddComment}
                    onViewProfile={handleViewProfile}
                    theme={currentTheme}
                    onLoadMore={() => console.log('load more')}
                    hasMorePosts={false}
                    isFetchingPosts={false}
                />;
            case 'friends':
                return <FriendsPage 
                    friends={currentUser.friends.map(id => users[id])}
                    pendingRequests={currentUser.friendRequests.map(id => users[id])}
                    onAcceptRequest={(requesterId) => {
                        setCurrentUser(u => ({...u!, friends: [...u!.friends, requesterId], friendRequests: u!.friendRequests.filter(id => id !== requesterId)}));
                        setUsers(prev => ({...prev, [requesterId]: {...prev[requesterId], friends: [...prev[requesterId].friends, currentUser.id], sentRequests: prev[requesterId].sentRequests.filter(id => id !== currentUser.id)}}));
                    }}
                    onRejectRequest={(requesterId) => {
                        setCurrentUser(u => ({...u!, friendRequests: u!.friendRequests.filter(id => id !== requesterId)}));
                        setUsers(prev => ({...prev, [requesterId]: {...prev[requesterId], sentRequests: prev[requesterId].sentRequests.filter(id => id !== currentUser.id)}}));
                    }}
                    onViewProfile={handleViewProfile}
                    theme={currentTheme}
                />;
            case 'communities':
                return <CommunitiesPage
                    allCommunities={communities}
                    userCommunities={currentUser.communities}
                    onToggleCommunity={(id) => {
                        const isMember = currentUser.communities.includes(id);
                        setCurrentUser(u => ({...u!, communities: isMember ? u!.communities.filter(cId => cId !== id) : [...u!.communities, id]}));
                        setCommunities(prev => prev.map(c => c.id === id ? {...c, members: isMember ? c.members-1 : c.members+1} : c));
                    }}
                    onViewCommunity={(id) => { setViewedCommunityId(id); setCurrentPage('communityDetail'); }}
                    onCreateCommunity={(name, imageUrl, theme) => setCommunities(prev => [{id: Date.now(), name, imageUrl: imageUrl || 'https://picsum.photos/seed/newcommunity/200/200', members: 1, theme}, ...prev])}
                    theme={currentTheme}
                />;
            case 'communityDetail':
                 const community = communities.find(c => c.id === viewedCommunityId);
                 if (!community) return <div>Community not found</div>;
                 return <CommunityDetailPage 
                    community={community}
                    currentUser={currentUser}
                    onToggleCommunity={(id) => {
                        const isMember = currentUser.communities.includes(id);
                        setCurrentUser(u => ({...u!, communities: isMember ? u!.communities.filter(cId => cId !== id) : [...u!.communities, id]}));
                        setCommunities(prev => prev.map(c => c.id === id ? {...c, members: isMember ? c.members-1 : c.members+1} : c));
                    }}
                    onNavigate={handleNavigate}
                    onViewProfile={handleViewProfile}
                 />;
            case 'photos':
                return <PhotosPage 
                    theme={currentTheme}
                    albums={albums}
                    onCreateAlbum={(name) => setAlbums(prev => [{id: `album-${Date.now()}`, name, photos:[]}, ...prev])}
                    onAddPhotos={(albumId, photos) => setAlbums(prev => prev.map(a => a.id === albumId ? {...a, photos: [...a.photos, ...photos]} : a))}
                    onDeletePhoto={(albumId, photoId) => setAlbums(prev => prev.map(a => a.id === albumId ? {...a, photos: a.photos.filter(p => p.id !== photoId)}: a))}
                />;
            case 'videos':
                 return <VideosPage 
                    theme={currentTheme}
                    currentUser={currentUser}
                    playlists={playlists}
                    onCreatePlaylist={(name) => setPlaylists(prev => [{id: `playlist-${Date.now()}`, name, videos:[]}, ...prev])}
                    onAddVideos={(playlistId, videos) => setPlaylists(prev => prev.map(p => p.id === playlistId ? {...p, videos: [...p.videos, ...videos]} : p))}
                    onDeleteVideo={(playlistId, videoId) => setPlaylists(prev => prev.map(p => p.id === playlistId ? {...p, videos: p.videos.filter(v => v.id !== videoId)} : p))}
                    onUpdateVideo={(playlistId, video) => setPlaylists(prev => prev.map(p => p.id === playlistId ? {...p, videos: p.videos.map(v => v.id === video.id ? video : v)} : p))}
                 />;
            case 'settings':
                return <SettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onCancel={() => handleViewProfile(currentUser.id)} theme={currentTheme}/>;
            case 'search':
                return <SearchPage 
                    query={searchQuery}
                    currentUser={currentUser}
                    allUsers={Object.values(users)}
                    usersMap={users}
                    posts={posts}
                    communities={communities}
                    onViewProfile={handleViewProfile}
                    onViewCommunity={(id) => { setViewedCommunityId(id); setCurrentPage('communityDetail'); }}
                    theme={currentTheme}
                />;
            default:
                return <div>Page not found</div>
        }
    }
    
    return (
        <div className={`min-h-screen ${currentTheme.bg}`}>
            <Header 
                currentUser={currentUser}
                onSearch={(query) => { setSearchQuery(query); setCurrentPage('search'); }}
                onNavigate={handleNavigate}
                onViewProfile={handleViewProfile}
                onLogout={handleLogout}
                theme={currentTheme}
                onToggleChatbot={() => setIsChatbotOpen(p => !p)}
            />
            <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <ProfileSidebar
                    currentUser={currentUser}
                    onNavigate={handleNavigate}
                    onViewProfile={handleViewProfile}
                    theme={currentTheme}
                    currentPage={currentPage}
                />
                <div className="flex-1 min-w-0">
                    {renderPage()}
                </div>
            </main>
            {/* Chat UI */}
            <ChatSidebar
                friends={currentUser.friends.map(id => users[id])}
                chatMessages={chatMessages}
                currentUser={currentUser}
                onOpenChat={(userId) => {
                    if (!openChatWindows.includes(userId)) {
                        setOpenChatWindows(prev => [...prev, userId]);
                    }
                    setFocusedChat(userId);
                }}
                theme={currentTheme}
            />
            {openChatWindows.map((userId, index) => {
                const friend = users[userId];
                const zIndex = focusedChat === userId ? 95 : 90 + index;
                return (
                    <div key={userId} onClick={() => setFocusedChat(userId)}>
                        <ChatWindow 
                            currentUser={currentUser}
                            friend={friend}
                            messages={chatMessages.filter(m => (m.senderId === currentUser.id && m.recipientId === userId) || (m.senderId === userId && m.recipientId === currentUser.id))}
                            onSendMessage={async (content) => {
                                const newMessage: ChatMessage = {id: Date.now(), senderId: currentUser.id, recipientId: userId, content, timestamp: new Date().toISOString(), read: true, linkPreview: null};
                                const urlMatch = content.match(URL_REGEX);
                                if (urlMatch) {
                                    newMessage.linkPreview = await fetchLinkPreview(urlMatch[0]);
                                }
                                setChatMessages(prev => [...prev, newMessage]);
                            }}
                            onClose={() => setOpenChatWindows(prev => prev.filter(id => id !== userId))}
                            theme={currentTheme}
                            zIndex={zIndex}
                        />
                    </div>
                );
            })}
            {isChatbotOpen && <Chatbot currentUser={currentUser} onClose={() => setIsChatbotOpen(false)} theme={currentTheme} />}
        </div>
    );
};

export default App;
