// Fix: Create the ProfileSidebar component.
import React from 'react';
import type { User } from '../types';
import { StarIcon, CameraIcon, VideoIcon, MessageIcon, UserIcon, GroupIcon, NewspaperIcon } from './icons';

interface FriendshipProps {
    currentUser: User;
    viewedUser: User;
    onSendFriendRequest: (recipientId: number) => void;
    onNavigate: (page: 'profile' | 'friends' | 'editProfile' | 'communities' | 'photos' | 'videos' | 'posts') => void;
    onBlockUser: (userId: number) => void;
    onUnblockUser: (userId: number) => void;
    theme: { [key: string]: string };
}

const FriendshipStatus: React.FC<FriendshipProps> = ({ currentUser, viewedUser, onSendFriendRequest, onNavigate, onBlockUser, onUnblockUser, theme }) => {
    const isBlockedByYou = currentUser.blockedUserIds.includes(viewedUser.id);

    if (currentUser.id === viewedUser.id) {
        return <button onClick={() => onNavigate('editProfile')} className={`text-sm ${theme.link} hover:underline`}>Editar meu perfil</button>;
    }
    
    if (isBlockedByYou) {
         return (
             <div className="text-center">
                <p className={`text-sm ${theme.subtleText} italic`}>Usuário bloqueado.</p>
                <button onClick={() => onUnblockUser(viewedUser.id)} className={`text-xs ${theme.link} hover:underline mt-1`}>Desbloquear</button>
            </div>
        );
    }

    if (currentUser.friends.includes(viewedUser.id)) {
        return <p className={`text-sm ${theme.subtleText} flex items-center justify-center space-x-1`}><UserIcon /><span>Amigos</span></p>;
    }

    if (currentUser.sentRequests.includes(viewedUser.id)) {
        return <p className={`text-sm ${theme.subtleText} italic text-center`}>Pedido de amizade enviado</p>;
    }

    if (currentUser.friendRequests.includes(viewedUser.id)) {
        return <button onClick={() => onNavigate('friends')} className={`text-sm ${theme.subtleText} italic text-center hover:underline`}>Responder ao pedido</button>;
    }

    return (
        <button 
            onClick={() => onSendFriendRequest(viewedUser.id)}
            className={`w-full ${theme.button} ${theme.buttonText} text-sm font-bold py-1 px-4 rounded-md hover:opacity-90`}
        >
            Adicionar aos amigos
        </button>
    );
};

interface ProfileSidebarProps {
    currentUser: User;
    viewedUser: User;
    onSendFriendRequest: (recipientId: number) => void;
    onNavigate: (page: 'profile' | 'friends' | 'editProfile' | 'communities' | 'photos' | 'videos' | 'posts') => void;
    onViewProfile: (userId: number) => void;
    onBlockUser: (userId: number) => void;
    onUnblockUser: (userId: number) => void;
    theme: { [key: string]: string };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ currentUser, viewedUser, onSendFriendRequest, onNavigate, onViewProfile, onBlockUser, onUnblockUser, theme }) => {
    return (
        <aside className="w-64 flex-shrink-0">
            <div className={`${theme.panelBg} rounded-md border ${theme.panelBorder} shadow-sm overflow-hidden`}>
                <div className="relative">
                    <img src={viewedUser.bannerUrl} alt={`${viewedUser.name}'s banner`} className="w-full h-24 object-cover" />
                    <img src={viewedUser.profilePicUrl} alt={viewedUser.name} className={`w-24 h-24 rounded-md absolute -bottom-12 left-1/2 -translate-x-1/2 border-4 ${theme.panelBorder}`} />
                </div>
                <div className="pt-14 p-3">
                    <h2 className={`text-lg font-bold ${theme.link} mt-2 text-center`}>{viewedUser.name}</h2>
                    <div className={`text-sm ${theme.subtleText} mt-2 space-y-1 text-center`}>
                        <p>{viewedUser.relationship}, {viewedUser.occupation}</p>
                        <p>{viewedUser.city}, {viewedUser.country}</p>
                    </div>
                    <div className={`mt-3 border-t ${theme.panelBorder} pt-3`}>
                        <FriendshipStatus 
                            currentUser={currentUser} 
                            viewedUser={viewedUser} 
                            onSendFriendRequest={onSendFriendRequest} 
                            onNavigate={onNavigate} 
                            onBlockUser={onBlockUser}
                            onUnblockUser={onUnblockUser}
                            theme={theme} 
                        />
                    </div>
                     {currentUser.id !== viewedUser.id && !currentUser.blockedUserIds.includes(viewedUser.id) && (
                        <div className="text-center mt-2">
                            <button onClick={() => onBlockUser(viewedUser.id)} className={`text-xs ${theme.subtleText} hover:underline`}>Bloquear usuário</button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${theme.panelBg} p-3 rounded-md border ${theme.panelBorder} shadow-sm mt-4`}>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                        <UserIcon />
                        <button onClick={() => onViewProfile(currentUser.id)} className={`${theme.link} hover:underline`}>Meu Perfil</button>
                    </li>
                     <li className="flex items-center space-x-2">
                        <NewspaperIcon />
                        <button onClick={() => onNavigate('posts')} className={`${theme.link} hover:underline`}>Posts</button>
                    </li>
                    <li className="flex items-center space-x-2">
                        <MessageIcon />
                        <button onClick={() => onViewProfile(viewedUser.id)} className={`${theme.link} hover:underline`}>Recados</button>
                    </li>
                    <li className="flex items-center space-x-2">
                        <CameraIcon />
                        <button onClick={() => onNavigate('photos')} className={`${theme.link} hover:underline`}>Fotos</button>
                    </li>
                     <li className="flex items-center space-x-2">
                        <VideoIcon />
                        <button onClick={() => onNavigate('videos')} className={`${theme.link} hover:underline`}>Vídeos</button>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GroupIcon />
                        <button onClick={() => onNavigate('communities')} className={`${theme.link} hover:underline`}>Comunidades</button>
                    </li>
                </ul>
            </div>
            
            <div className={`${theme.panelBg} p-3 rounded-md border ${theme.panelBorder} shadow-sm mt-4`}>
                <h3 className={`font-bold ${theme.text} mb-2`}>Social</h3>
                <div className={`flex justify-around text-center text-sm ${theme.subtleText}`}>
                    <div>
                        <span className="font-bold block">{viewedUser.friends.length}</span>
                        <span>amigos</span>
                    </div>
                    <div>
                        <span className="font-bold block">12</span>
                        <span>fotos</span>
                    </div>
                    <div>
                        <span className="font-bold block">5</span>
                        <span>fãs</span>
                    </div>
                    <div>
                        <span className="font-bold block">9/10</span>
                        <span className="flex items-center justify-center"><StarIcon /></span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;