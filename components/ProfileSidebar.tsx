// Fix: Create the ProfileSidebar component.
import React from 'react';
import type { User } from '../types';
import { StarIcon, CameraIcon, VideoIcon, MessageIcon, UserIcon, GroupIcon } from './icons';

interface FriendshipProps {
    currentUser: User;
    viewedUser: User;
    onSendFriendRequest: (recipientId: number) => void;
    onNavigate: (page: 'profile' | 'friends' | 'editProfile') => void;
}

const FriendshipStatus: React.FC<FriendshipProps> = ({ currentUser, viewedUser, onSendFriendRequest, onNavigate }) => {
    if (currentUser.id === viewedUser.id) {
        return <button onClick={() => onNavigate('editProfile')} className="text-sm text-[#3366CC] hover:underline">Editar meu perfil</button>;
    }

    if (currentUser.friends.includes(viewedUser.id)) {
        return <p className="text-sm text-gray-600 flex items-center justify-center space-x-1"><UserIcon /><span>Amigos</span></p>;
    }

    if (currentUser.sentRequests.includes(viewedUser.id)) {
        return <p className="text-sm text-gray-500 italic text-center">Pedido de amizade enviado</p>;
    }

    if (currentUser.friendRequests.includes(viewedUser.id)) {
        // In a real app, this would navigate to the friends page
        return <p className="text-sm text-gray-500 italic text-center">Responder ao pedido</p>;
    }

    return (
        <button 
            onClick={() => onSendFriendRequest(viewedUser.id)}
            className="w-full bg-[#ED008C] text-white text-sm font-bold py-1 px-4 rounded-md hover:bg-[#D4007C]"
        >
            Adicionar aos amigos
        </button>
    );
};

interface ProfileSidebarProps {
    currentUser: User;
    viewedUser: User;
    onSendFriendRequest: (recipientId: number) => void;
    onNavigate: (page: 'profile' | 'friends' | 'editProfile') => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ currentUser, viewedUser, onSendFriendRequest, onNavigate }) => {
    return (
        <aside className="w-64 flex-shrink-0">
            <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm">
                <img src={viewedUser.profilePicUrl} alt={viewedUser.name} className="w-full h-auto rounded-md" />
                <h2 className="text-lg font-bold text-[#3366CC] mt-2">{viewedUser.name}</h2>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p>{viewedUser.relationship}, {viewedUser.occupation}</p>
                    <p>{viewedUser.city}, {viewedUser.country}</p>
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3">
                    <FriendshipStatus currentUser={currentUser} viewedUser={viewedUser} onSendFriendRequest={onSendFriendRequest} onNavigate={onNavigate}/>
                </div>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm mt-4">
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                        <UserIcon />
                        <a href="#" className="text-[#3366CC] hover:underline">Meu Perfil</a>
                    </li>
                    <li className="flex items-center space-x-2">
                        <MessageIcon />
                        <a href="#" className="text-[#3366CC] hover:underline">Recados</a>
                    </li>
                    <li className="flex items-center space-x-2">
                        <CameraIcon />
                        <a href="#" className="text-[#3366CC] hover:underline">Fotos</a>
                    </li>
                     <li className="flex items-center space-x-2">
                        <VideoIcon />
                        <a href="#" className="text-[#3366CC] hover:underline">Vídeos</a>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GroupIcon />
                        <a href="#" className="text-[#3366CC] hover:underline">Comunidades</a>
                    </li>
                </ul>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm mt-4">
                <h3 className="font-bold text-gray-700 mb-2">Social</h3>
                <div className="flex justify-around text-center text-sm">
                    <div>
                        <span className="font-bold block">{viewedUser.friends.length}</span>
                        <span className="text-gray-600">amigos</span>
                    </div>
                    <div>
                        <span className="font-bold block">12</span>
                        <span className="text-gray-600">fotos</span>
                    </div>
                    <div>
                        <span className="font-bold block">5</span>
                        <span className="text-gray-600">fãs</span>
                    </div>
                    <div>
                        <span className="font-bold block">9/10</span>
                        <span className="text-gray-600 flex items-center justify-center"><StarIcon /></span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;