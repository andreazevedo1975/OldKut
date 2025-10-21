import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import ProfileSidebar from './components/ProfileSidebar';
import MainContent from './components/MainContent';
import FriendsPage from './components/FriendsPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import CommunitiesPage from './components/CommunitiesPage';
import PhotosPage from './components/PhotosPage';
import VideosPage from './components/VideosPage';
import PostsPage from './components/PostsPage';
import CommunityDetailPage from './components/CommunityDetailPage';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import Chatbot from './components/Chatbot';
import { SparklesIcon } from './components/icons';
import type { User, Scrap, Testimonial, Community, Post, PostComment, ChatMessage, ProfileVisit, Notification } from './types';
import type { Session, RealtimeChannel } from '@supabase/supabase-js';


export type CurrentPage = 'profile' | 'friends' | 'settings' | 'communities' | 'photos' | 'videos' | 'posts' | 'communityDetail';
export type ActiveTab = 'scraps' | 'testimonials';


export const THEMES: { [key: string]: { [key: string]: string } } = {
    classic: {
        bg: 'bg-[#D4E4F7]',
        header: 'bg-[#ED008C]',
        headerText: 'text-white',
        link: 'text-[#3366CC]',
        button: 'bg-[#ED008C]',
        buttonText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-gray-600',
        panelBg: 'bg-white',
        panelBorder: 'border-gray-300',
        footer: 'bg-[#ED008C]',
        subtleBg: 'bg-gray-100',
        subtleBgHover: 'hover:bg-gray-200',
        inputBg: 'bg-white',
    },
    pink: {
        bg: 'bg-pink-50',
        header: 'bg-pink-500',
        headerText: 'text-white',
        link: 'text-pink-600',
        button: 'bg-pink-500',
        buttonText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-pink-900',
        panelBg: 'bg-white',
        panelBorder: 'border-pink-200',
        footer: 'bg-pink-500',
        subtleBg: 'bg-pink-100',
        subtleBgHover: 'hover:bg-pink-200',
        inputBg: 'bg-white',
    },
    dark: {
        bg: 'bg-gray-800',
        header: 'bg-gray-900',
        headerText: 'text-pink-400',
        link: 'text-cyan-400',
        button: 'bg-pink-600',
        buttonText: 'text-white',
        text: 'text-gray-200',
        subtleText: 'text-gray-400',
        panelBg: 'bg-gray-700',
        panelBorder: 'border-gray-600',
        footer: 'bg-gray-900',
        subtleBg: 'bg-gray-600',
        subtleBgHover: 'hover:bg-gray-500',
        inputBg: 'bg-gray-600',
    },
    green: {
        bg: 'bg-green-50',
        header: 'bg-green-700',
        headerText: 'text-white',
        link: 'text-green-800',
        button: 'bg-green-600',
        buttonText: 'text-white',
        text: 'text-gray-800',
        subtleText: 'text-green-900',
        panelBg: 'bg-white',
        panelBorder: 'border-green-200',
        footer: 'bg-green-700',
        subtleBg: 'bg-green-100',
        subtleBgHover: 'hover:bg-green-200',
        inputBg: 'bg-white',
    }
};


const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [scraps, setScraps] = useState<Scrap[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [communities, setCommunities] = useState<{ [key: number]: Community }>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [openChatWindows, setOpenChatWindows] = useState<string[]>([]);
    const [profileVisits, setProfileVisits] = useState<ProfileVisit[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [currentPage, setCurrentPage] = useState<CurrentPage>('profile');
    const [viewedUserId, setViewedUserId] = useState<string | null>(null);
    const [viewedCommunityId, setViewedCommunityId] = useState<number | null>(null);
    const [initialProfileTab, setInitialProfileTab] = useState<ActiveTab | null>(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    // State for post pagination
    const [postsPage, setPostsPage] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isFetchingPosts, setIsFetchingPosts] = useState(false);
    const POSTS_PER_PAGE = 5;

    const notificationsChannel = useRef<RealtimeChannel | null>(null);

    // Session management
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
        // Return cached user if available
        if (users[userId]) {
            return users[userId];
        }
        
        const { data, error } = await supabase.rpc('get_user_profile', { user_id_param: userId });
        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
        if (data) {
            setUsers(prev => ({...prev, [data.id]: data }));
            return data;
        }
        return null;
    }, [users]);

    // Fetch current user's profile and core data
    useEffect(() => {
        if (session) {
            fetchUserProfile(session.user.id).then(user => {
                if (user) {
                    setCurrentUser(user);
                    if (!viewedUserId) {
                        setViewedUserId(user.id);
                    }
                }
            });
        }
    }, [session, viewedUserId, fetchUserProfile]);


    // Fetch initial posts for the user's feed
    useEffect(() => {
        if (session) {
            const fetchInitialPosts = async () => {
                setIsFetchingPosts(true);
                setPosts([]);
                setPostsPage(0);
                setHasMorePosts(true);
                
                const { data, error } = await supabase.rpc('get_post_feed', { 
                    user_id_param: session.user.id,
                    limit_param: POSTS_PER_PAGE,
                    offset_param: 0 
                });

                if (error) {
                    console.error('Error fetching initial post feed:', error);
                } else if (data) {
                    setPosts(data);
                    if (data.length < POSTS_PER_PAGE) {
                        setHasMorePosts(false);
                    }
                    const userIdsToFetch = new Set<string>();
                    data.forEach((post: Post) => {
                        if (!users[post.authorId]) userIdsToFetch.add(post.authorId);
                        post.comments.forEach(comment => {
                            if (!users[comment.authorId]) userIdsToFetch.add(comment.authorId);
                        });
                    });
                    userIdsToFetch.forEach(fetchUserProfile);
                }
                setIsFetchingPosts(false);
            };
            fetchInitialPosts();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // Fetch and subscribe to notifications
    useEffect(() => {
        if (session?.user?.id) {
            const fetchInitialNotifications = async () => {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('recipient_id', session.user.id)
                    .order('created_at', { ascending: false })
                    .limit(30);

                if (error) {
                    console.error('Error fetching notifications:', error);
                } else if (data) {
                    const formattedData: Notification[] = data.map(n => ({...n, actorId: n.actor_id, recipientId: n.recipient_id, targetId: n.target_id, timestamp: n.created_at}));
                    setNotifications(formattedData);
                    const actorIds = new Set(data.map(n => n.actor_id));
                    actorIds.forEach(id => {
                        if (!users[id]) fetchUserProfile(id);
                    });
                }
            };

            fetchInitialNotifications();

            if (notificationsChannel.current) {
                notificationsChannel.current.unsubscribe();
            }
            
            const channel = supabase.channel(`notifications:${session.user.id}`)
                .on<Notification>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${session.user.id}` },
                (payload) => {
                    const newNotification: Notification = {...payload.new, actorId: payload.new.actor_id, recipientId: payload.new.recipient_id, targetId: payload.new.target_id, timestamp: payload.new.created_at};
                    setNotifications(prev => [newNotification, ...prev]);
                    if (!users[newNotification.actorId]) {
                        fetchUserProfile(newNotification.actorId);
                    }
                })
                .subscribe();

            notificationsChannel.current = channel;

            return () => {
                if (notificationsChannel.current) {
                    supabase.removeChannel(notificationsChannel.current);
                }
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);


    const handleLoadMorePosts = async () => {
        if (isFetchingPosts || !hasMorePosts || !session) return;
    
        const nextPageToFetch = postsPage + 1;
        setIsFetchingPosts(true);
    
        const { data, error } = await supabase.rpc('get_post_feed', { 
            user_id_param: session.user.id, 
            limit_param: POSTS_PER_PAGE, 
            offset_param: nextPageToFetch * POSTS_PER_PAGE 
        });
    
        if (error) {
            console.error("Error fetching more posts:", error);
        } else if (data) {
            setPosts(prevPosts => [...prevPosts, ...data]);
            setPostsPage(nextPageToFetch);
            if (data.length < POSTS_PER_PAGE) {
                setHasMorePosts(false);
            }
            const userIdsToFetch = new Set<string>();
            data.forEach((post: Post) => {
                if (!users[post.authorId]) userIdsToFetch.add(post.authorId);
                post.comments.forEach(comment => {
                    if (!users[comment.authorId]) userIdsToFetch.add(comment.authorId);
                });
            });
            userIdsToFetch.forEach(fetchUserProfile);
        }
    
        setIsFetchingPosts(false);
    };


    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setViewedUserId(null);
    };
    
    const viewedUser = viewedUserId ? users[viewedUserId] : null;
    const viewedCommunity = viewedCommunityId ? communities[viewedCommunityId] : null;

    const handleNavigate = (page: CurrentPage) => {
        if (page === 'profile' && currentUser) {
            setViewedUserId(currentUser.id);
        }
        setCurrentPage(page);
    };

    const handleViewProfile = async (userId: string, options?: { initialTab?: ActiveTab }) => {
        if (!users[userId]) {
            await fetchUserProfile(userId);
        }
        setViewedUserId(userId);
        setCurrentPage('profile');
        setInitialProfileTab(options?.initialTab || null);
        
        if (currentUser && currentUser.id !== userId) {
            await supabase.from('profile_visits').insert({ visitor_id: currentUser.id, visited_id: userId });
        }
    };
    
    const handleViewCommunity = (communityId: number) => {
        setViewedCommunityId(communityId);
        setCurrentPage('communityDetail');
    };

    const handleAddPost = async (content: string) => {
        if (!currentUser) return;

        // The RPC function 'create_post_and_get' will handle insertion and return the formatted post
        const { data, error } = await supabase.rpc('create_post_and_get', { p_author_id: currentUser.id, p_content: content });
    
        if (error) {
            console.error("Error creating post:", error);
            alert("Não foi possível criar o post. Tente novamente.");
        } else if (data && data.length > 0) {
            setPosts(prevPosts => [data[0], ...prevPosts]);
        }
    };
    
    const handleToggleLike = async (postId: number) => {
        if (!currentUser) return;
    
        const originalPosts = posts.map(p => ({...p, likedByIds: [...p.likedByIds]}));
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;
    
        const postToUpdate = { ...posts[postIndex] };
        const isLiked = postToUpdate.likedByIds.includes(currentUser.id);
        
        if (isLiked) {
            postToUpdate.likedByIds = postToUpdate.likedByIds.filter(id => id !== currentUser.id);
        } else {
            postToUpdate.likedByIds.push(currentUser.id);
        }
        
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = postToUpdate;
        setPosts(updatedPosts); // Optimistic update
    
        const { error } = await supabase.rpc('toggle_like', { 
            post_id_param: postId, 
            user_id_param: currentUser.id 
        });
    
        if (error) {
            console.error("Error toggling like:", error);
            setPosts(originalPosts); // Revert on error
            alert("Não foi possível curtir o post. Tente novamente.");
        }
    };
    
    const handleAddComment = async (postId: number, content: string) => {
        if (!currentUser) return;
    
        const { data, error } = await supabase.from('post_comments').insert({
            post_id: postId,
            author_id: currentUser.id,
            content: content
        }).select().single();
    
        if (error) {
            console.error("Error adding comment:", error);
            alert("Não foi possível adicionar o comentário. Tente novamente.");
        } else if (data) {
            const newComment: PostComment = {
                id: data.id,
                authorId: data.author_id,
                content: data.content,
                timestamp: data.created_at
            };
            setPosts(prevPosts => prevPosts.map(post => {
                if (post.id === postId) {
                    return { ...post, comments: [...post.comments, newComment] };
                }
                return post;
            }));
        }
    };

    const handleUpdateProfile = async (updatedData: Partial<User>, navigateOnSuccess: boolean = true) => {
        if (!currentUser) return;

        // The 'profiles' table uses the user's UUID as the primary key.
        const { error } = await supabase
            .from('profiles')
            .update(updatedData)
            .eq('id', currentUser.id);

        if (error) {
            console.error("Error updating profile:", error);
            alert("Não foi possível atualizar o perfil.");
        } else {
            // Optimistic update of local state
            const updatedUser = { ...currentUser, ...updatedData };
            setCurrentUser(updatedUser);
            // Also update the master user list
            setUsers(prev => ({ ...prev, [currentUser.id]: updatedUser }));
            
            if (navigateOnSuccess) {
                 handleNavigate('profile');
            }
        }
    };

    const handleOpenChat = (userId: string) => {
        if (!openChatWindows.includes(userId)) {
            setOpenChatWindows(prev => [...prev, userId]);
        }
    };

    const handleCloseChat = (userId: string) => {
        setOpenChatWindows(prev => prev.filter(id => id !== userId));
    };

    const handleSendChatMessage = async (recipientId: string, content: string) => {
        if (!currentUser) return;

        const { data, error } = await supabase.from('chat_messages').insert({
            sender_id: currentUser.id,
            recipient_id: recipientId,
            content: content,
        }).select().single();

        if (error) {
            console.error("Error sending chat message:", error);
        } else if (data) {
             const newMessage: ChatMessage = {
                id: data.id,
                senderId: data.sender_id,
                recipientId: data.recipient_id,
                content: data.content,
                timestamp: data.created_at,
                read: false, // It's read by default for the sender
            };
            setChatMessages(prev => [...prev, newMessage]);
        }
    };
    
    const handleMarkNotificationAsRead = async (notificationId: number, callback?: () => void) => {
        const notification = notifications.find(n => n.id === notificationId);
        // Only update if it's currently unread
        if (notification && !notification.read) {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
            const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
            if (error) {
                console.error('Error marking notification as read:', error);
                // Revert on error if desired
                setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: false } : n));
            }
        }
        // Execute callback regardless of read status
        callback?.();
    };

    const handleMarkAllNotificationsAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        
        const { error } = await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
        if (error) {
            console.error('Error marking all notifications as read:', error);
            // Revert on error if desired
            setNotifications(prev => prev.map(n => unreadIds.includes(n.id) ? { ...n, read: false } : n));
        }
    };


    if (loading) {
        return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Carregando OldKut...</div>;
    }

    if (!session || !currentUser) {
        return <LoginPage />;
    }
    
    if (!viewedUser && currentPage === 'profile') {
        return <div>Carregando perfil...</div>;
    }

    const currentTheme = THEMES[currentUser.theme] || THEMES.classic;
    
    // This is a simplified version. In a real app, this data would be fetched on demand.
    const friends = (currentUser.friends || []).map(id => users[id]).filter(Boolean);

    // Dummy data until fully implemented
    const pendingRequests: User[] = [];
    const viewedUserScraps: Scrap[] = [];
    const viewedUserTestimonials: Testimonial[] = [];
    const viewedUserCommunities: Community[] = [];
    const recentVisitors: User[] = [];

    const availableUsersForSearch: User[] = Object.values(users);

    const renderPage = () => {
        switch(currentPage) {
            case 'profile':
                if (!viewedUser) return <div>Carregando perfil...</div>;
                return (
                     <MainContent 
                        currentUser={currentUser} 
                        viewedUser={viewedUser} 
                        users={users}
                        scraps={viewedUserScraps} 
                        testimonials={viewedUserTestimonials} 
                        communities={viewedUserCommunities} 
                        recentVisitors={recentVisitors}
                        addScrap={async (content) => console.log("Add scrap", content, viewedUser.id)} 
                        addTestimonial={async (content) => console.log("Add testimonial", content, viewedUser.id)} 
                        approveTestimonial={async (id) => console.log("Approve testimonial", id)} 
                        rejectTestimonial={async (id) => console.log("Reject testimonial", id)} 
                        onViewProfile={handleViewProfile} 
                        onNavigate={handleNavigate}
                        onViewCommunity={handleViewCommunity}
                        onToggleOrkutear={async (id, type) => console.log("Toggle orkutear", id, type)}
                        onSendFriendRequest={async (id) => console.log("Send friend request", id)}
                        onBlockUser={async (id) => console.log("Block user", id)}
                        onUnblockUser={async (id) => console.log("Unblock user", id)}
                        theme={currentTheme}
                        initialProfileTab={initialProfileTab}
                        onClearInitialTab={() => setInitialProfileTab(null)}
                    />
                );
            case 'posts':
                return (
                    <PostsPage
                        posts={posts}
                        users={users}
                        currentUser={currentUser}
                        onAddPost={handleAddPost}
                        onToggleLike={handleToggleLike}
                        onAddComment={handleAddComment}
                        onViewProfile={handleViewProfile}
                        theme={currentTheme}
                        onLoadMore={handleLoadMorePosts}
                        hasMorePosts={hasMorePosts}
                        isFetchingPosts={isFetchingPosts}
                    />
                );
             case 'photos':
                return <PhotosPage theme={currentTheme} />;
            case 'videos':
                return <VideosPage theme={currentTheme} currentUser={currentUser} />;
            case 'communities':
                return <CommunitiesPage allCommunities={Object.values(communities)} userCommunities={currentUser.communities} onToggleCommunity={async (id) => console.log("Toggle community", id)} onViewCommunity={handleViewCommunity} onCreateCommunity={async (name, url) => console.log("Create community", name, url)} theme={currentTheme} />;
            case 'communityDetail':
                 if (!viewedCommunity) return <div>Carregando comunidade...</div>;
                 return <CommunityDetailPage community={viewedCommunity} theme={currentTheme} />;
            case 'friends':
                return (
                    <FriendsPage
                        friends={friends}
                        pendingRequests={pendingRequests}
                        onAcceptRequest={async (id) => console.log("Accept request", id)}
                        onRejectRequest={async (id) => console.log("Reject request", id)}
                        onViewProfile={handleViewProfile}
                        theme={currentTheme}
                    />
                );
            case 'settings':
                return (
                    <SettingsPage
                        currentUser={currentUser}
                        onUpdateProfile={handleUpdateProfile}
                        onCancel={() => handleNavigate('profile')}
                        theme={currentTheme}
                    />
                );
            default:
                return <div>Página não encontrada</div>;
        }
    };
    
    return (
        <div className={`${currentTheme.bg} min-h-screen font-sans flex flex-col`}>
            <Header 
                currentUser={currentUser} 
                onNavigate={handleNavigate} 
                onViewProfile={handleViewProfile} 
                allUsers={availableUsersForSearch} 
                onLogout={handleLogout} 
                theme={currentTheme} 
                notifications={notifications}
                users={users}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
            <main className="container mx-auto px-4 py-4 flex-grow flex space-x-4">
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
            <footer className={`w-full ${currentTheme.footer} ${currentTheme.headerText} text-center py-2 text-xs shadow-inner mt-4`}>
                <p>© {new Date().getFullYear()} OldKut by André Azevedo. All rights reserved.</p>
            </footer>
            
            <ChatSidebar 
                friends={friends} 
                chatMessages={chatMessages} 
                currentUser={currentUser} 
                onOpenChat={handleOpenChat} 
                theme={currentTheme} 
            />
            <div className="fixed bottom-0 right-96 flex items-end space-x-4">
                {openChatWindows.map((userId, index) => {
                    const friend = users[userId];
                    if (!friend) return null;
                    const messagesForWindow = chatMessages.filter(m => 
                        (m.senderId === userId && m.recipientId === currentUser.id) || 
                        (m.senderId === currentUser.id && m.recipientId === userId)
                    );
                    return (
                        <ChatWindow
                            key={userId}
                            currentUser={currentUser}
                            friend={friend}
                            messages={messagesForWindow}
                            onSendMessage={(content) => handleSendChatMessage(userId, content)}
                            onClose={() => handleCloseChat(userId)}
                            theme={currentTheme}
                            zIndex={100 + index}
                        />
                    );
                })}
            </div>
            
            <div className="fixed bottom-4 right-4 z-[101]">
                <button
                    onClick={() => setIsChatbotOpen(prev => !prev)}
                    className={`p-3 rounded-full shadow-lg transition-transform hover:scale-110 ${currentTheme.button} ${currentTheme.buttonText}`}
                    aria-label="Abrir assistente"
                >
                    <SparklesIcon className="w-6 h-6" />
                </button>
            </div>
            {isChatbotOpen && (
                <Chatbot 
                    currentUser={currentUser}
                    onClose={() => setIsChatbotOpen(false)}
                    theme={currentTheme}
                />
            )}
        </div>
    );
};

export default App;
