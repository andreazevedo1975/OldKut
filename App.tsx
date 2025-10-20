import React, { useState } from 'react';
import Header from './components/Header';
import ProfileSidebar from './components/ProfileSidebar';
import MainContent from './components/MainContent';
import FriendsPage from './components/FriendsPage';
import EditProfilePage from './components/EditProfilePage';
import LoginPage from './components/LoginPage';
import CommunitiesPage from './components/CommunitiesPage';
import PhotosPage from './components/PhotosPage';
import VideosPage from './components/VideosPage';
import CommunityDetailPage from './components/CommunityDetailPage';
import { MOCK_USERS, MOCK_SCRAPS, MOCK_TESTIMONIALS, MOCK_COMMUNITIES } from './constants';
import type { User, Scrap, Testimonial, Community } from './types';

type CurrentPage = 'profile' | 'friends' | 'editProfile' | 'communities' | 'photos' | 'videos' | 'communityDetail';

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
    }
};


const App: React.FC = () => {
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

    const [users, setUsers] = useState<{ [key: number]: User }>(MOCK_USERS);
    const [scraps, setScraps] = useState<Scrap[]>(MOCK_SCRAPS);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);

    const [currentPage, setCurrentPage] = useState<CurrentPage>('profile');
    const [viewedUserId, setViewedUserId] = useState<number | null>(null);
    const [viewedCommunityId, setViewedCommunityId] = useState<number | null>(null);


    const handleLogin = (userId: number) => {
        setLoggedInUserId(userId);
        setViewedUserId(userId);
        setCurrentPage('profile');
    };

    const handleLogout = () => {
        setLoggedInUserId(null);
        setViewedUserId(null);
    };

    const handleCreateAccount = (newUser: Omit<User, 'id' | 'friends' | 'friendRequests' | 'sentRequests' | 'communities' | 'profilePicUrl' | 'avatarUrl' | 'blockedUserIds'>) => {
        const newId = Date.now();
        const picUrl = `https://i.pravatar.cc/150?u=${newId}`;
        const userWithId: User = {
            ...newUser,
            id: newId,
            profilePicUrl: picUrl,
            avatarUrl: picUrl,
            friends: [],
            friendRequests: [],
            sentRequests: [],
            communities: [],
            blockedUserIds: [],
        };
        setUsers(prev => ({...prev, [newId]: userWithId}));
        handleLogin(newId);
    };
    
    const currentUser = loggedInUserId ? users[loggedInUserId] : null;
    const viewedUser = viewedUserId ? users[viewedUserId] : null;
    const viewedCommunity = viewedCommunityId ? MOCK_COMMUNITIES[viewedCommunityId] : null;

    const handleNavigate = (page: CurrentPage) => {
        if (page === 'profile' && currentUser) {
            setViewedUserId(currentUser.id);
        }
        setCurrentPage(page);
    };

    const handleViewProfile = (userId: number) => {
        setViewedUserId(userId);
        setCurrentPage('profile');
    };
    
    const handleViewCommunity = (communityId: number) => {
        setViewedCommunityId(communityId);
        setCurrentPage('communityDetail');
    };


    const handleSendFriendRequest = (recipientId: number) => {
       if (!currentUser || currentUser.blockedUserIds.includes(recipientId) || users[recipientId].blockedUserIds.includes(currentUser.id)) return;
        setUsers(prevUsers => {
            const newUsers = { ...prevUsers };
            const sender = newUsers[currentUser.id];
            
            if (sender.friends.includes(recipientId) || sender.sentRequests.includes(recipientId) || sender.friendRequests.includes(recipientId)) {
                return prevUsers; 
            }

            newUsers[currentUser.id] = {
                ...sender,
                sentRequests: [...sender.sentRequests, recipientId]
            };
            newUsers[recipientId] = {
                ...newUsers[recipientId],
                friendRequests: [...newUsers[recipientId].friendRequests, currentUser.id]
            };
            return newUsers;
        });
    };
    
    const handleAcceptRequest = (requesterId: number) => {
        if (!currentUser) return;
         setUsers(prevUsers => {
            const newUsers = { ...prevUsers };
            const currentUserId = currentUser.id;

            newUsers[currentUserId] = {
                ...newUsers[currentUserId],
                friendRequests: newUsers[currentUserId].friendRequests.filter(id => id !== requesterId),
                friends: [...newUsers[currentUserId].friends, requesterId]
            };

            newUsers[requesterId] = {
                ...newUsers[requesterId],
                sentRequests: newUsers[requesterId].sentRequests.filter(id => id !== currentUserId),
                friends: [...newUsers[requesterId].friends, currentUserId]
            };
            
            return newUsers;
        });
    };

    const handleRejectRequest = (requesterId: number) => {
        if (!currentUser) return;
         setUsers(prevUsers => {
            const newUsers = { ...prevUsers };
            const currentUserId = currentUser.id;

            newUsers[currentUserId] = {
                ...newUsers[currentUserId],
                friendRequests: newUsers[currentUserId].friendRequests.filter(id => id !== requesterId)
            };
            newUsers[requesterId] = {
                ...newUsers[requesterId],
                sentRequests: newUsers[requesterId].sentRequests.filter(id => id !== currentUserId)
            };
            return newUsers;
        });
    };

    const handleAddScrap = (content: string, recipientId: number) => {
        if (!currentUser || currentUser.blockedUserIds.includes(recipientId) || users[recipientId].blockedUserIds.includes(currentUser.id)) {
            alert("Você não pode enviar recados para este usuário.");
            return;
        };
        const newScrap: Scrap = {
            id: Date.now(),
            authorId: currentUser.id,
            recipientId,
            content,
            timestamp: 'Agora',
            orkutedByIds: [],
        };
        setScraps(prevScraps => [newScrap, ...prevScraps]);
    };

    const handleAddTestimonial = (content: string, recipientId: number) => {
        if (!currentUser || currentUser.blockedUserIds.includes(recipientId) || users[recipientId].blockedUserIds.includes(currentUser.id)) {
             alert("Você não pode enviar depoimentos para este usuário.");
            return;
        }
        const newTestimonial: Testimonial = {
            id: Date.now(),
            authorId: currentUser.id,
            recipientId,
            content,
            approved: false,
            orkutedByIds: [],
        };
        setTestimonials(prev => [...prev, newTestimonial]);
        alert('Depoimento enviado para aprovação!');
    };

    const handleApproveTestimonial = (testimonialId: number) => {
        setTestimonials(prev => prev.map(t => t.id === testimonialId ? { ...t, approved: true } : t));
    };

    const handleRejectTestimonial = (testimonialId: number) => {
        setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    };
    
    const handleUpdateProfile = (updatedData: Partial<User>) => {
        if (!currentUser) return;
        setUsers(prevUsers => ({
            ...prevUsers,
            [currentUser.id]: { ...prevUsers[currentUser.id], ...updatedData }
        }));
        handleViewProfile(currentUser.id);
    };

    const handleToggleCommunityMembership = (communityId: number) => {
        if (!currentUser) return;
        setUsers(prev => {
            const newUsers = { ...prev };
            const user = newUsers[currentUser.id];
            const isMember = user.communities.includes(communityId);
            
            newUsers[currentUser.id] = {
                ...user,
                communities: isMember 
                    ? user.communities.filter(id => id !== communityId)
                    : [...user.communities, communityId]
            };
            return newUsers;
        });
    };

    const handleToggleOrkutear = (itemId: number, itemType: 'scrap' | 'testimonial') => {
        if (!currentUser) return;
        const userId = currentUser.id;

        if (itemType === 'scrap') {
            setScraps(prev => prev.map(scrap => {
                if (scrap.id === itemId) {
                    const isOrkuted = scrap.orkutedByIds.includes(userId);
                    return {
                        ...scrap,
                        orkutedByIds: isOrkuted
                            ? scrap.orkutedByIds.filter(id => id !== userId)
                            : [...scrap.orkutedByIds, userId]
                    };
                }
                return scrap;
            }));
        } else { // testimonial
            setTestimonials(prev => prev.map(testimonial => {
                if (testimonial.id === itemId) {
                    const isOrkuted = testimonial.orkutedByIds.includes(userId);
                    return {
                        ...testimonial,
                        orkutedByIds: isOrkuted
                            ? testimonial.orkutedByIds.filter(id => id !== userId)
                            : [...testimonial.orkutedByIds, userId]
                    };
                }
                return testimonial;
            }));
        }
    };

    const handleBlockUser = (userIdToBlock: number) => {
        if (!currentUser) return;
        const currentUserId = currentUser.id;

        setUsers(prev => {
            const newUsers = { ...prev };
            // Add to blocker's list
            newUsers[currentUserId] = {
                ...newUsers[currentUserId],
                blockedUserIds: [...newUsers[currentUserId].blockedUserIds, userIdToBlock],
                friends: newUsers[currentUserId].friends.filter(id => id !== userIdToBlock),
                friendRequests: newUsers[currentUserId].friendRequests.filter(id => id !== userIdToBlock),
                sentRequests: newUsers[currentUserId].sentRequests.filter(id => id !== userIdToBlock),
            };
            // Remove from blocked user's lists
            newUsers[userIdToBlock] = {
                ...newUsers[userIdToBlock],
                friends: newUsers[userIdToBlock].friends.filter(id => id !== currentUserId),
                friendRequests: newUsers[userIdToBlock].friendRequests.filter(id => id !== currentUserId),
                sentRequests: newUsers[userIdToBlock].sentRequests.filter(id => id !== currentUserId),
            };
            return newUsers;
        });
    };
    
    const handleUnblockUser = (userIdToUnblock: number) => {
        if (!currentUser) return;
        setUsers(prev => {
            const newUsers = { ...prev };
            newUsers[currentUser.id] = {
                ...newUsers[currentUser.id],
                blockedUserIds: newUsers[currentUser.id].blockedUserIds.filter(id => id !== userIdToUnblock),
            };
            return newUsers;
        });
    };

    if (!currentUser || !loggedInUserId) {
        return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} existingUsers={Object.values(users)} />;
    }
    
    if (!viewedUser) {
        return <div>Carregando perfil...</div>;
    }

    const currentTheme = THEMES[viewedUser.theme] || THEMES.classic;
    const isBlocked = currentUser.blockedUserIds.includes(viewedUser.id) || viewedUser.blockedUserIds.includes(currentUser.id);

    const viewedUserCommunities = viewedUser?.communities.map(id => MOCK_COMMUNITIES[id]).filter(Boolean) || [];
    const friends = currentUser.friends.map(id => users[id]).filter(Boolean);
    const pendingRequests = currentUser.friendRequests.map(id => users[id]).filter(Boolean);
    const viewedUserScraps = scraps.filter(s => s.recipientId === viewedUser.id);
    const viewedUserTestimonials = testimonials.filter(t => t.recipientId === viewedUser.id);
    
    const availableUsersForSearch = Object.values(users).filter(user => 
        !currentUser.blockedUserIds.includes(user.id) &&
        !user.blockedUserIds.includes(currentUser.id)
    );

    const renderPage = () => {
        if (currentPage === 'profile' && isBlocked && currentUser.id !== viewedUser.id) {
             return (
                 <div className={`${currentTheme.panelBg} p-6 rounded-md border ${currentTheme.panelBorder} shadow-sm text-center`}>
                     <h2 className={`text-xl font-light ${currentTheme.subtleText} mb-4`}>
                         Usuário Bloqueado
                     </h2>
                     <p className={`${currentTheme.text}`}>
                         Você não pode ver o perfil deste usuário.
                     </p>
                    {currentUser.blockedUserIds.includes(viewedUser.id) && (
                         <button onClick={() => handleUnblockUser(viewedUser.id)} className={`mt-4 ${currentTheme.button} ${currentTheme.buttonText} text-sm font-bold py-1 px-4 rounded-md hover:opacity-90`}>
                            Desbloquear
                         </button>
                     )}
                 </div>
             );
        }
        
        switch(currentPage) {
            case 'friends':
                return <FriendsPage friends={friends} pendingRequests={pendingRequests} onAcceptRequest={handleAcceptRequest} onRejectRequest={handleRejectRequest} onViewProfile={handleViewProfile} theme={currentTheme} />;
            case 'editProfile':
                 return <EditProfilePage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onCancel={() => handleViewProfile(currentUser.id)} theme={currentTheme} />;
            case 'communities':
                 return <CommunitiesPage allCommunities={Object.values(MOCK_COMMUNITIES)} userCommunities={currentUser.communities} onToggleCommunity={handleToggleCommunityMembership} onViewCommunity={handleViewCommunity} theme={currentTheme} />;
            case 'photos':
                return <PhotosPage theme={currentTheme} />;
            case 'videos':
                return <VideosPage theme={currentTheme} />;
            case 'communityDetail':
                 if (!viewedCommunity) return <div>Comunidade não encontrada.</div>
                 return <CommunityDetailPage community={viewedCommunity} theme={currentTheme} />;
            case 'profile':
            default:
                return (
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <ProfileSidebar 
                            currentUser={currentUser} 
                            viewedUser={viewedUser} 
                            onSendFriendRequest={handleSendFriendRequest} 
                            onNavigate={handleNavigate} 
                            onViewProfile={handleViewProfile} 
                            onBlockUser={handleBlockUser}
                            onUnblockUser={handleUnblockUser}
                            theme={currentTheme} 
                        />
                        <MainContent 
                            currentUser={currentUser} 
                            viewedUser={viewedUser} 
                            users={users}
                            scraps={viewedUserScraps} 
                            testimonials={viewedUserTestimonials} 
                            communities={viewedUserCommunities} 
                            addScrap={(content) => handleAddScrap(content, viewedUser.id)} 
                            addTestimonial={(content) => handleAddTestimonial(content, viewedUser.id)} 
                            approveTestimonial={handleApproveTestimonial} 
                            rejectTestimonial={handleRejectTestimonial} 
                            onViewProfile={handleViewProfile} 
                            onNavigate={handleNavigate}
                            onViewCommunity={handleViewCommunity}
                            onToggleOrkutear={handleToggleOrkutear}
                            theme={currentTheme} 
                        />
                    </div>
                );
        }
    };
    
    return (
        <div className={`${currentTheme.bg} min-h-screen font-sans flex flex-col`}>
            <Header currentUser={currentUser} onNavigate={handleNavigate} onViewProfile={handleViewProfile} pendingRequestsCount={currentUser.friendRequests.length} allUsers={availableUsersForSearch} onLogout={handleLogout} theme={currentTheme} />
            <main className="container mx-auto px-4 py-4 flex-grow">
                {renderPage()}
            </main>
            <footer className={`w-full ${currentTheme.footer} ${currentTheme.headerText} text-center py-2 text-xs shadow-inner mt-4`}>
                <p>© {new Date().getFullYear()} OldKut by André Azevedo. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;