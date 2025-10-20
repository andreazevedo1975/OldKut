// Fix: Implement the main App component to manage state and render the UI.
import React, { useState } from 'react';
import Header from './components/Header';
import ProfileSidebar from './components/ProfileSidebar';
import MainContent from './components/MainContent';
import FriendsPage from './components/FriendsPage';
import EditProfilePage from './components/EditProfilePage';
import type { User, Scrap, Testimonial } from './types';
import { MOCK_USERS, MOCK_SCRAPS, MOCK_TESTIMONIALS, MOCK_COMMUNITIES } from './constants';

const App: React.FC = () => {
    // Assume user with ID 1 is the current logged-in user
    const [users, setUsers] = useState<{ [key: number]: User }>(MOCK_USERS);
    const [currentUser, setCurrentUser] = useState<User>(users[1]);
    const [scraps, setScraps] = useState<Scrap[]>(MOCK_SCRAPS);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
    
    const [currentPage, setCurrentPage] = useState<'profile' | 'friends' | 'editProfile'>('profile');
    const [viewedProfileId, setViewedProfileId] = useState<number>(1);

    const handleViewProfile = (userId: number) => {
        setViewedProfileId(userId);
        setCurrentPage('profile');
    };

    const handleAddScrap = (content: string) => {
        const newScrap: Scrap = {
            id: Date.now(),
            authorId: currentUser.id,
            content,
            timestamp: 'Agora'
        };
        setScraps([newScrap, ...scraps]);
    };

    const handleAddTestimonial = (content: string) => {
        const newTestimonial: Testimonial = {
            id: Date.now(),
            authorId: currentUser.id, 
            content,
            approved: false
        };
        setTestimonials([newTestimonial, ...testimonials]);
    };
    
    const handleApproveTestimonial = (id: number) => {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, approved: true } : t));
    };

    const handleRejectTestimonial = (id: number) => {
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    const handleSendFriendRequest = (recipientId: number) => {
        const updatedUsers = { ...users };

        const sender = { ...updatedUsers[currentUser.id] };
        if (!sender.sentRequests.includes(recipientId)) {
            sender.sentRequests = [...sender.sentRequests, recipientId];
        }

        const recipient = { ...updatedUsers[recipientId] };
        if (!recipient.friendRequests.includes(currentUser.id)) {
            recipient.friendRequests = [...recipient.friendRequests, currentUser.id];
        }

        updatedUsers[currentUser.id] = sender;
        updatedUsers[recipientId] = recipient;
        
        setUsers(updatedUsers);
        setCurrentUser(sender);
    };
    
    const handleAcceptRequest = (requesterId: number) => {
        const updatedUsers = { ...users };

        const acceptor = { ...updatedUsers[currentUser.id] };
        acceptor.friends = [...acceptor.friends, requesterId];
        acceptor.friendRequests = acceptor.friendRequests.filter(id => id !== requesterId);

        const requester = { ...updatedUsers[requesterId] };
        requester.friends = [...requester.friends, currentUser.id];
        requester.sentRequests = requester.sentRequests.filter(id => id !== currentUser.id);

        updatedUsers[currentUser.id] = acceptor;
        updatedUsers[requesterId] = requester;

        setCurrentUser(acceptor);
        setUsers(updatedUsers);
    };

    const handleRejectRequest = (requesterId: number) => {
        const updatedUsers = { ...users };

        const rejector = { ...updatedUsers[currentUser.id] };
        rejector.friendRequests = rejector.friendRequests.filter(id => id !== requesterId);

        const requester = { ...updatedUsers[requesterId] };
        requester.sentRequests = requester.sentRequests.filter(id => id !== currentUser.id);

        updatedUsers[currentUser.id] = rejector;
        updatedUsers[requesterId] = requester;

        setCurrentUser(rejector);
        setUsers(updatedUsers);
    };

    const handleUpdateProfile = (updatedData: Partial<User>) => {
        const updatedUser = { ...currentUser, ...updatedData };
        
        setUsers(prevUsers => ({
            ...prevUsers,
            [currentUser.id]: updatedUser
        }));
        setCurrentUser(updatedUser);
        setCurrentPage('profile'); // Go back to profile after saving
    };

    const viewedUser = users[viewedProfileId];

    const userCommunities = viewedUser.communities
        .map(id => MOCK_COMMUNITIES[id])
        .filter(Boolean);

    const friends = currentUser.friends
        .map(id => users[id])
        .filter(Boolean);
    
    const pendingRequests = currentUser.friendRequests
        .map(id => users[id])
        .filter(Boolean);

    return (
        <div className="bg-[#DDEEF5] min-h-screen font-sans">
            <Header 
                currentUser={currentUser} 
                onNavigate={setCurrentPage}
                onViewProfile={handleViewProfile}
                pendingRequestsCount={pendingRequests.length}
                allUsers={Object.values(users)}
            />
            <main className="container mx-auto px-4 py-6">
                <div className="flex space-x-6">
                    <ProfileSidebar 
                        currentUser={currentUser} 
                        viewedUser={viewedUser}
                        onSendFriendRequest={handleSendFriendRequest}
                        onNavigate={setCurrentPage}
                    />
                    <div className="flex-1">
                        {currentPage === 'profile' && viewedUser && (
                             <MainContent
                                currentUser={currentUser}
                                viewedUser={viewedUser}
                                scraps={scraps}
                                testimonials={testimonials}
                                communities={userCommunities}
                                addScrap={handleAddScrap}
                                addTestimonial={handleAddTestimonial}
                                approveTestimonial={handleApproveTestimonial}
                                rejectTestimonial={handleRejectTestimonial}
                             />
                        )}
                        {currentPage === 'friends' && (
                            <FriendsPage 
                                friends={friends}
                                pendingRequests={pendingRequests}
                                onAcceptRequest={handleAcceptRequest}
                                onRejectRequest={handleRejectRequest}
                                onViewProfile={handleViewProfile}
                            />
                        )}
                        {currentPage === 'editProfile' && (
                            <EditProfilePage 
                                currentUser={currentUser}
                                onUpdateProfile={handleUpdateProfile}
                                onCancel={() => setCurrentPage('profile')}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;