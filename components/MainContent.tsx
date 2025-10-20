import React, { useState } from 'react';
import type { User, Scrap, Testimonial, Community } from '../types';
import { MOCK_USERS } from '../constants';

interface ScrapWriterProps {
  viewedUser: User;
  onAddScrap: (content: string) => void;
}

interface ScrapListProps {
  scraps: Scrap[];
}

const ScrapWriter: React.FC<ScrapWriterProps> = ({ viewedUser, onAddScrap }) => {
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
                    <button type="submit" className="bg-[#ED008C] text-white text-sm font-bold py-1 px-4 rounded-md hover:bg-[#D4007C]">
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};

const ScrapList: React.FC<ScrapListProps> = ({ scraps }) => {
    return (
        <div className="mt-4 space-y-3">
            {scraps.map(scrap => {
                const author = MOCK_USERS[scrap.authorId];
                if (!author) return null;
                return (
                    <div key={scrap.id} className="flex items-start space-x-3 p-2 border-b border-gray-200">
                        <img src={author.profilePicUrl} alt={author.name} className="w-12 h-12 rounded-sm" />
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <a href="#" className="text-[#3366CC] font-bold text-sm hover:underline">{author.name}</a>
                                <span className="text-xs text-gray-400">{scrap.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-800 mt-1">{scrap.content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface TestimonialWriterProps {
  viewedUser: User;
  onAddTestimonial: (content: string) => void;
}

const TestimonialWriter: React.FC<TestimonialWriterProps> = ({ viewedUser, onAddTestimonial }) => {
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
                    <button type="submit" className="bg-[#ED008C] text-white text-sm font-bold py-1 px-4 rounded-md hover:bg-[#D4007C]">
                        Enviar Depoimento
                    </button>
                </div>
            </form>
        </div>
    );
};

interface TestimonialListProps {
    testimonials: Testimonial[];
    approveTestimonial: (id: number) => void;
    rejectTestimonial: (id: number) => void;
    isOwnProfile: boolean;
}

const TestimonialList: React.FC<TestimonialListProps> = ({ testimonials, approveTestimonial, rejectTestimonial, isOwnProfile }) => {
    return (
        <div className="mt-4 space-y-3">
            {testimonials.length === 0 && <p className="text-sm text-gray-600">Nenhum depoimento ainda.</p>}
            {testimonials.map(testimonial => {
                const author = MOCK_USERS[testimonial.authorId];
                if (!author) return null;
                // Only show approved testimonials on other people's profiles
                if (!isOwnProfile && !testimonial.approved) return null;

                return (
                    <div key={testimonial.id} className={`flex items-start space-x-3 p-2 border-b border-gray-200 ${!testimonial.approved ? 'bg-[#FFF8E7]' : ''}`}>
                        <img src={author.profilePicUrl} alt={author.name} className="w-12 h-12 rounded-sm" />
                        <div className="flex-1">
                            <a href="#" className="text-[#3366CC] font-bold text-sm hover:underline">{author.name}</a>
                            <p className="text-sm text-gray-800 mt-1 italic">"{testimonial.content}"</p>
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
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const CommunityList: React.FC<{ communities: Community[] }> = ({ communities }) => {
  return (
    <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm mt-4">
      <h3 className="font-bold text-gray-700 mb-2">Minhas Comunidades ({communities.length})</h3>
      <ul className="space-y-2">
        {communities.map(community => (
          <li key={community.id} className="flex items-center space-x-2">
            <img src={community.imageUrl} alt={community.name} className="w-8 h-8"/>
            <a href="#" className="text-sm text-[#3366CC] hover:underline">{community.name}</a>
          </li>
        ))}
      </ul>
      <a href="#" className="text-xs text-[#3366CC] hover:underline mt-2 block text-right">ver todas</a>
    </div>
  );
};

interface MainContentProps {
  currentUser: User;
  viewedUser: User;
  scraps: Scrap[];
  testimonials: Testimonial[];
  communities: Community[];
  addScrap: (content: string) => void;
  addTestimonial: (content: string) => void;
  approveTestimonial: (id: number) => void;
  rejectTestimonial: (id: number) => void;
}

type ActiveTab = 'scraps' | 'testimonials';

const MainContent: React.FC<MainContentProps> = ({ currentUser, viewedUser, scraps, testimonials, communities, addScrap, addTestimonial, approveTestimonial, rejectTestimonial }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scraps');
  const isOwnProfile = currentUser.id === viewedUser.id;
  
  const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => {
      const isActive = activeTab === tabName;
      return (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-1 text-sm font-bold ${isActive ? 'bg-[#FDE8F4] text-[#ED008C] border-b-2 border-[#ED008C]' : 'text-gray-600 hover:bg-gray-200'}`}
        >
            {label}
        </button>
      )
  }

  return (
    <div className="w-full">
        <div className="bg-white p-4 rounded-md border border-gray-300 shadow-sm">
            <h2 className="text-xl font-light text-gray-600 mb-2">
                 {isOwnProfile 
                    ? `Bem-vindo, ${currentUser.name.split(' ')[0]}!`
                    : `Perfil de ${viewedUser.name}`
                }
            </h2>
            <div className="flex border-b border-gray-300">
                <TabButton tabName="scraps" label={`Recados (${scraps.length})`} />
                <TabButton tabName="testimonials" label={`Depoimentos (${testimonials.length})`} />
            </div>

            <div className="mt-4">
                {activeTab === 'scraps' && (
                    <>
                        <ScrapWriter viewedUser={viewedUser} onAddScrap={addScrap} />
                        <ScrapList scraps={scraps} />
                    </>
                )}
                {activeTab === 'testimonials' && (
                    <>
                        {!isOwnProfile && <TestimonialWriter viewedUser={viewedUser} onAddTestimonial={addTestimonial} />}
                        <TestimonialList 
                            testimonials={testimonials} 
                            approveTestimonial={approveTestimonial} 
                            rejectTestimonial={rejectTestimonial} 
                            isOwnProfile={isOwnProfile}
                        />
                    </>
                )}
            </div>
        </div>

        <CommunityList communities={communities} />
    </div>
  );
};

export default MainContent;