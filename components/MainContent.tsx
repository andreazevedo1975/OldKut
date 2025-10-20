import React, { useState } from 'react';
import type { User, Scrap, Testimonial, Community } from '../types';
import { HeartIcon } from './icons';

interface ScrapListProps {
  scraps: Scrap[];
  users: { [key: number]: User };
  onViewProfile: (userId: number) => void;
  onToggleOrkutear: (itemId: number, itemType: 'scrap' | 'testimonial') => void;
  currentUserId: number;
  theme: { [key: string]: string };
}

const ScrapList: React.FC<ScrapListProps> = ({ scraps, users, onViewProfile, onToggleOrkutear, currentUserId, theme }) => {
    return (
        <div className="mt-4 space-y-3">
            {scraps.length === 0 && <p className={`text-sm ${theme.subtleText}`}>Nenhum recado ainda.</p>}
            {scraps.map(scrap => {
                const author = users[scrap.authorId];
                if (!author) return null;
                const isOrkutedByCurrentUser = scrap.orkutedByIds.includes(currentUserId);
                return (
                    <div key={scrap.id} className={`flex items-start space-x-3 p-2 border-b ${theme.panelBorder}`}>
                        <button onClick={() => onViewProfile(author.id)}>
                           <img src={author.profilePicUrl} alt={author.name} className="w-12 h-12 rounded-sm" />
                        </button>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <button onClick={() => onViewProfile(author.id)} className={`${theme.link} font-bold text-sm hover:underline`}>{author.name}</button>
                                <span className="text-xs text-gray-400">{scrap.timestamp}</span>
                            </div>
                            <p className={`text-sm ${theme.text} mt-1`}>{scrap.content}</p>
                            <div className="mt-2 flex items-center space-x-2">
                                <button onClick={() => onToggleOrkutear(scrap.id, 'scrap')} className={`flex items-center space-x-1 text-xs ${isOrkutedByCurrentUser ? 'text-pink-500' : theme.subtleText} hover:text-pink-500`}>
                                    <HeartIcon filled={isOrkutedByCurrentUser} className={`w-3.5 h-3.5 ${isOrkutedByCurrentUser ? 'text-pink-500' : ''}`} />
                                    <span>{isOrkutedByCurrentUser ? 'Orkutido!' : 'Orkutear'}</span>
                                </button>
                                {scrap.orkutedByIds.length > 0 && (
                                     <span className="text-xs text-gray-400">&middot; {scrap.orkutedByIds.length}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface TestimonialListProps {
    testimonials: Testimonial[];
    users: { [key: number]: User };
    approveTestimonial: (id: number) => void;
    rejectTestimonial: (id: number) => void;
    isOwnProfile: boolean;
    onViewProfile: (userId: number) => void;
    onToggleOrkutear: (itemId: number, itemType: 'testimonial') => void;
    currentUserId: number;
    theme: { [key: string]: string };
}

const TestimonialList: React.FC<TestimonialListProps> = ({ testimonials, users, approveTestimonial, rejectTestimonial, isOwnProfile, onViewProfile, onToggleOrkutear, currentUserId, theme }) => {
    return (
        <div className="mt-4 space-y-3">
            {testimonials.length === 0 && <p className={`text-sm ${theme.subtleText}`}>Nenhum depoimento ainda.</p>}
            {testimonials.map(testimonial => {
                const author = users[testimonial.authorId];
                if (!author) return null;
                if (!isOwnProfile && !testimonial.approved) return null;
                const isOrkutedByCurrentUser = testimonial.orkutedByIds.includes(currentUserId);

                return (
                    <div key={testimonial.id} className={`flex items-start space-x-3 p-2 border-b ${theme.panelBorder} ${!testimonial.approved ? 'bg-[#FFF8E7]' : ''}`}>
                        <button onClick={() => onViewProfile(author.id)}>
                            <img src={author.profilePicUrl} alt={author.name} className="w-12 h-12 rounded-sm" />
                        </button>
                        <div className="flex-1">
                            <button onClick={() => onViewProfile(author.id)} className={`${theme.link} font-bold text-sm hover:underline`}>{author.name}</button>
                            <p className={`text-sm ${theme.text} mt-1 italic`}>"{testimonial.content}"</p>
                             {!testimonial.approved && isOwnProfile && (
                                <div className="mt-2 text-xs flex items-center space-x-2">
                                    <span className="text-[#C47500] font-semibold">Aguardando aprovação</span>
                                    <button
                                        onClick={() => approveTestimonial(testimonial.id)}
                                        className="px-2 py-0.5 bg-green-500 text-white rounded-sm text-xs hover:bg-green-600"
                                    >
                                        Aprovar
                                    </button>
                                    <button
                                        onClick={() => rejectTestimonial(testimonial.id)}
                                        className="px-2 py-0.5 bg-red-500 text-white rounded-sm text-xs hover:bg-red-600"
                                    >
                                        Rejeitar
                                    </button>
                                </div>
                            )}
                            {testimonial.approved && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <button onClick={() => onToggleOrkutear(testimonial.id, 'testimonial')} className={`flex items-center space-x-1 text-xs ${isOrkutedByCurrentUser ? 'text-pink-500' : theme.subtleText} hover:text-pink-500`}>
                                        <HeartIcon filled={isOrkutedByCurrentUser} className={`w-3.5 h-3.5 ${isOrkutedByCurrentUser ? 'text-pink-500' : ''}`} />
                                        <span>{isOrkutedByCurrentUser ? 'Orkutido!' : 'Orkutear'}</span>
                                    </button>
                                    {testimonial.orkutedByIds.length > 0 && (
                                         <span className="text-xs text-gray-400">&middot; {testimonial.orkutedByIds.length}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface ScrapWriterProps {
  viewedUser: User;
  onAddScrap: (content: string) => void;
  theme: { [key: string]: string };
}
const ScrapWriter: React.FC<ScrapWriterProps> = ({ viewedUser, onAddScrap, theme }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddScrap(content);
            setContent('');
        }
    };

    return (
        <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Deixar um recado:</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-20 p-2 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC]"
                    placeholder={`Escreva um recado para ${viewedUser.name.split(' ')[0]}...`}
                    maxLength={255}
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{content.length} / 255</span>
                    <button type="submit" className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1 px-4 rounded-md hover:opacity-90`}>
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};


interface TestimonialWriterProps {
  viewedUser: User;
  onAddTestimonial: (content: string) => void;
  theme: { [key: string]: string };
}
const TestimonialWriter: React.FC<TestimonialWriterProps> = ({ viewedUser, onAddTestimonial, theme }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddTestimonial(content);
            setContent('');
        }
    };

    return (
        <div className="bg-gray-100 p-3 rounded-md border border-gray-300 mb-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Escrever um depoimento:</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-24 p-2 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#3366CC]"
                    placeholder={`Deixe um depoimento para ${viewedUser.name.split(' ')[0]}...`}
                />
                <div className="flex justify-end items-center mt-2">
                    <button type="submit" className={`${theme.button} ${theme.buttonText} text-sm font-bold py-1 px-4 rounded-md hover:opacity-90`}>
                        Enviar Depoimento
                    </button>
                </div>
            </form>
        </div>
    );
};


const CommunityList: React.FC<{ communities: Community[], theme: { [key: string]: string }, title: string, onNavigate: (page: 'communities') => void, onViewCommunity: (id: number) => void }> = ({ communities, theme, title, onNavigate, onViewCommunity }) => {
  return (
    <div className={`${theme.panelBg} p-3 rounded-md border ${theme.panelBorder} shadow-sm mt-4`}>
      <h3 className={`font-bold ${theme.text} mb-2`}>{title} ({communities.length})</h3>
      <ul className="space-y-2">
        {communities.map(community => (
          <li key={community.id} className="flex items-center space-x-2">
            <img src={community.imageUrl} alt={community.name} className="w-8 h-8"/>
            <button onClick={() => onViewCommunity(community.id)} className={`text-sm ${theme.link} hover:underline`}>{community.name}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onNavigate('communities')} className={`text-xs ${theme.link} hover:underline mt-2 block text-right w-full`}>ver todas</button>
    </div>
  );
};

interface MainContentProps {
  currentUser: User;
  viewedUser: User;
  users: { [key: number]: User };
  scraps: Scrap[];
  testimonials: Testimonial[];
  communities: Community[];
  addScrap: (content: string) => void;
  addTestimonial: (content: string) => void;
  approveTestimonial: (id: number) => void;
  rejectTestimonial: (id: number) => void;
  onViewProfile: (userId: number) => void;
  onNavigate: (page: 'communities') => void;
  onViewCommunity: (communityId: number) => void;
  onToggleOrkutear: (itemId: number, itemType: 'scrap' | 'testimonial') => void;
  theme: { [key: string]: string };
}

type ActiveTab = 'scraps' | 'testimonials';

const MainContent: React.FC<MainContentProps> = ({ currentUser, viewedUser, users, scraps, testimonials, communities, addScrap, addTestimonial, approveTestimonial, rejectTestimonial, onViewProfile, onNavigate, onViewCommunity, onToggleOrkutear, theme }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scraps');
  const isOwnProfile = currentUser.id === viewedUser.id;
  
  const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => {
      const isActive = activeTab === tabName;
      const activeStyle = theme.bg === 'bg-gray-800' 
        ? `bg-gray-600 ${theme.text} border-b-2 border-cyan-400`
        : `bg-pink-50 text-pink-600 border-b-2 border-pink-500`;

      return (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-1 text-sm font-bold ${isActive ? activeStyle : `${theme.subtleText} hover:bg-gray-200`}`}
        >
            {label}
        </button>
      )
  }

  return (
    <div className="w-full">
        <div className={`${theme.panelBg} p-4 rounded-md border ${theme.panelBorder} shadow-sm`}>
            <h2 className={`text-xl font-light ${theme.subtleText} mb-2`}>
                 {isOwnProfile 
                    ? `Bem-vindo, ${currentUser.name.split(' ')[0]}!`
                    : `Perfil de ${viewedUser.name}`
                }
            </h2>
            <div className={`flex border-b ${theme.panelBorder}`}>
                <TabButton tabName="scraps" label={`Recados (${scraps.length})`} />
                <TabButton tabName="testimonials" label={`Depoimentos (${testimonials.length})`} />
            </div>

            <div className="mt-4">
                {activeTab === 'scraps' && (
                    <>
                        <ScrapWriter viewedUser={viewedUser} onAddScrap={addScrap} theme={theme} />
                        <ScrapList 
                            scraps={scraps} 
                            users={users} 
                            onViewProfile={onViewProfile} 
                            onToggleOrkutear={onToggleOrkutear} 
                            currentUserId={currentUser.id} 
                            theme={theme}
                        />
                    </>
                )}
                {activeTab === 'testimonials' && (
                    <>
                        {!isOwnProfile && <TestimonialWriter viewedUser={viewedUser} onAddTestimonial={addTestimonial} theme={theme} />}
                        <TestimonialList 
                            testimonials={testimonials} 
                            users={users}
                            approveTestimonial={approveTestimonial} 
                            rejectTestimonial={rejectTestimonial} 
                            isOwnProfile={isOwnProfile}
                            onViewProfile={onViewProfile}
                            onToggleOrkutear={onToggleOrkutear}
                            currentUserId={currentUser.id}
                            theme={theme}
                        />
                    </>
                )}
            </div>
        </div>
        
        <CommunityList 
            communities={communities} 
            theme={theme} 
            title={isOwnProfile ? 'Minhas Comunidades' : `Comunidades de ${viewedUser.name.split(' ')[0]}`} 
            onNavigate={onNavigate}
            onViewCommunity={onViewCommunity}
        />
    </div>
  );
};

export default MainContent;