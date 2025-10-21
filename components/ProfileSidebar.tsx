// Fix: Create the ProfileSidebar component.
import React from 'react';
import type { User } from '../types';
import { CameraIcon, VideoIcon, MessageIcon, UserIcon, GroupIcon, NewspaperIcon, SettingsIcon } from './icons';
import type { ActiveTab, CurrentPage } from '../App';

interface ProfileSidebarProps {
    currentUser: User;
    onNavigate: (page: CurrentPage) => void;
    onViewProfile: (userId: string, options?: { initialTab?: ActiveTab }) => void;
    theme: { [key: string]: string };
    currentPage: CurrentPage;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ currentUser, onNavigate, onViewProfile, theme, currentPage }) => {
    
    const NavLink: React.FC<{
        icon: React.ReactNode;
        page: CurrentPage | CurrentPage[];
        label: string;
        onClick: () => void;
    }> = ({ icon, page, label, onClick }) => {
        const pages = Array.isArray(page) ? page : [page];
        const isActive = pages.includes(currentPage);
        
        return (
            <li className={`flex items-center space-x-2 p-1 rounded-md ${isActive ? theme.subtleBg : ''}`}>
                <div className={`w-6 h-6 flex items-center justify-center ${isActive ? theme.text : theme.subtleText}`}>
                    {icon}
                </div>
                <button 
                    onClick={onClick} 
                    className={`text-sm ${isActive ? `font-bold ${theme.text}` : `${theme.link} hover:underline`}`}
                >
                    {label}
                </button>
            </li>
        );
    };
    
    return (
        <aside className="w-64 flex-shrink-0 space-y-4">
            <div className={`${theme.panelBg} rounded-md border ${theme.panelBorder} shadow-sm overflow-hidden`}>
                <div className="relative h-24 bg-gray-200">
                    <img src={currentUser.bannerUrl} alt={`${currentUser.name}'s banner`} className="w-full h-full object-cover" />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <img 
                            src={currentUser.profilePicUrl} 
                            alt={currentUser.name} 
                            className={`w-24 h-24 rounded-md border-4 ${theme.panelBorder} shadow-lg`} 
                        />
                    </div>
                </div>
                <div className="pt-14 p-3 text-center">
                    <h2 className={`text-lg font-bold ${theme.link}`}>{currentUser.name}</h2>
                    <p className={`text-sm ${theme.subtleText} truncate`}>{currentUser.city}, {currentUser.country}</p>
                </div>
            </div>

            <div className={`${theme.panelBg} p-3 rounded-md border ${theme.panelBorder} shadow-sm`}>
                <ul className="space-y-1">
                    <NavLink icon={<UserIcon className="w-5 h-5"/>} page="profile" label="Meu Perfil" onClick={() => onNavigate('profile')} />
                    <NavLink icon={<NewspaperIcon className="w-5 h-5"/>} page="posts" label="Posts" onClick={() => onNavigate('posts')} />
                    {/* Meus Recados is a special tab on the profile page */}
                    <li className="flex items-center space-x-2 p-1">
                        <div className={`w-6 h-6 flex items-center justify-center ${theme.subtleText}`}><MessageIcon className="w-5 h-5" /></div>
                        <button onClick={() => onViewProfile(currentUser.id, { initialTab: 'scraps' })} className={`text-sm ${theme.link} hover:underline`}>Meus Recados</button>
                    </li>
                    <NavLink icon={<CameraIcon className="w-5 h-5"/>} page="photos" label="Fotos" onClick={() => onNavigate('photos')} />
                    <NavLink icon={<VideoIcon className="w-5 h-5"/>} page="videos" label="Vídeos" onClick={() => onNavigate('videos')} />
                    <NavLink icon={<GroupIcon className="w-5 h-5"/>} page={['communities', 'communityDetail']} label="Comunidades" onClick={() => onNavigate('communities')} />
                    <NavLink icon={<SettingsIcon className="w-5 h-5"/>} page="settings" label="Configurações" onClick={() => onNavigate('settings')} />
                </ul>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
