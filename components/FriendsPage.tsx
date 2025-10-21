import React from 'react';
import type { User } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface FriendsPageProps {
    friends: User[];
    pendingRequests: User[];
    onAcceptRequest: (requesterId: string) => void;
    onRejectRequest: (requesterId: string) => void;
    onViewProfile: (userId: string) => void;
    theme: { [key: string]: string };
}

const FriendsPage: React.FC<FriendsPageProps> = ({ friends, pendingRequests, onAcceptRequest, onRejectRequest, onViewProfile, theme }) => {
    return (
        <div className="space-y-6">
            {pendingRequests.length > 0 && (
                <div className={`${theme.panelBg} p-4 rounded-md border ${theme.panelBorder} shadow-sm`}>
                    <h2 className={`text-xl font-light ${theme.subtleText} mb-4`}>
                        Pedidos de amizade pendentes ({pendingRequests.length})
                    </h2>
                    <div className="space-y-3">
                        {pendingRequests.map(user => (
                            <div key={user.id} className={`flex items-center justify-between p-2 ${theme.subtleBg} rounded-md`}>
                                <div className="flex items-center space-x-3">
                                    <img src={user.profilePicUrl} alt={user.name} className="w-12 h-12 rounded-md" />
                                    <div>
                                        <button onClick={() => onViewProfile(user.id)} className={`text-sm font-bold ${theme.link} hover:underline`}>{user.name}</button>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => onAcceptRequest(user.id)}
                                        className="p-1 text-green-500 hover:text-green-700" 
                                        title="Aceitar"
                                    >
                                        <CheckCircleIcon className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={() => onRejectRequest(user.id)}
                                        className="p-1 text-red-500 hover:text-red-700" 
                                        title="Rejeitar"
                                    >
                                        <XCircleIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={`${theme.panelBg} p-4 rounded-md border ${theme.panelBorder} shadow-sm`}>
                <h2 className={`text-xl font-light ${theme.subtleText} mb-4`}>
                    Meus amigos ({friends.length})
                </h2>
                {friends.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {friends.map(friend => (
                            <div key={friend.id} className="text-center">
                                <button onClick={() => onViewProfile(friend.id)} className="block mx-auto">
                                    <img src={friend.profilePicUrl} alt={friend.name} className="w-24 h-24 rounded-md" />
                                </button>
                                <button onClick={() => onViewProfile(friend.id)} className={`text-sm ${theme.link} hover:underline mt-2 block w-full truncate`}>{friend.name}</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm ${theme.subtleText}`}>Você ainda não tem amigos.</p>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;