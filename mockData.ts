import type { User, Scrap, Testimonial, Community, Post, ChatMessage, Album, Photo, Video, Playlist, ProfileVisit, Notification } from './types';

// USERS
export const MOCK_USERS: { [key: string]: User } = {
    'user-1': {
        id: 'user-1',
        name: 'Ana Clara',
        profilePicUrl: 'https://i.pravatar.cc/150?u=1',
        avatarUrl: 'https://i.pravatar.cc/150?u=1',
        bannerUrl: 'https://picsum.photos/id/1018/800/200',
        email: 'ana.clara@example.com',
        dob: '1978-05-15',
        city: 'São Paulo',
        country: 'Brasil',
        relationship: 'Casada',
        occupation: 'Designer Gráfica',
        interests: ['Fotografia', 'Viagens', 'Culinária'],
        theme: 'pink',
        onlineStatus: 'online',
        friends: ['user-2', 'user-3', 'user-4'],
        friendRequests: ['user-5'],
        sentRequests: [],
        communities: [1, 3],
        emailNotifications: true,
        blockedUserIds: ['user-6'],
    },
    'user-2': {
        id: 'user-2',
        name: 'Bruno Alves',
        profilePicUrl: 'https://i.pravatar.cc/150?u=2',
        avatarUrl: 'https://i.pravatar.cc/150?u=2',
        bannerUrl: 'https://picsum.photos/id/1041/800/200',
        email: 'bruno.alves@example.com',
        dob: '1975-11-20',
        city: 'Rio de Janeiro',
        country: 'Brasil',
        relationship: 'Solteiro',
        occupation: 'Engenheiro',
        interests: ['Música', 'Cinema', 'Esportes'],
        theme: 'classic',
        onlineStatus: 'online',
        friends: ['user-1', 'user-4'],
        friendRequests: [],
        sentRequests: ['user-6'],
        communities: [1, 2],
        emailNotifications: true,
        blockedUserIds: [],
    },
    'user-3': {
        id: 'user-3',
        name: 'Carla Dias',
        profilePicUrl: 'https://i.pravatar.cc/150?u=3',
        avatarUrl: 'https://i.pravatar.cc/150?u=3',
        bannerUrl: 'https://picsum.photos/id/106/800/200',
        email: 'carla.dias@example.com',
        dob: '1980-02-10',
        city: 'Belo Horizonte',
        country: 'Brasil',
        relationship: 'Namorando',
        occupation: 'Médica',
        interests: ['Leitura', 'Yoga', 'Jardinagem'],
        theme: 'green',
        onlineStatus: 'away',
        friends: ['user-1'],
        friendRequests: [],
        sentRequests: [],
        communities: [3],
        emailNotifications: false,
        blockedUserIds: [],
    },
    'user-4': {
        id: 'user-4',
        name: 'Daniel Costa',
        profilePicUrl: 'https://i.pravatar.cc/150?u=4',
        avatarUrl: 'https://i.pravatar.cc/150?u=4',
        bannerUrl: 'https://picsum.photos/id/1050/800/200',
        email: 'daniel.costa@example.com',
        dob: '1972-09-01',
        city: 'Porto Alegre',
        country: 'Brasil',
        relationship: 'Divorciado',
        occupation: 'Advogado',
        interests: ['Pesca', 'Futebol', 'Churrasco'],
        theme: 'dark',
        onlineStatus: 'offline',
        friends: ['user-1', 'user-2'],
        friendRequests: [],
        sentRequests: [],
        communities: [2],
        emailNotifications: true,
        blockedUserIds: [],
    },
    'user-5': {
        id: 'user-5',
        name: 'Eduarda Lima',
        profilePicUrl: 'https://i.pravatar.cc/150?u=5',
        avatarUrl: 'https://i.pravatar.cc/150?u=5',
        bannerUrl: 'https://picsum.photos/id/119/800/200',
        email: 'eduarda.lima@example.com',
        dob: '1981-07-22',
        city: 'Curitiba',
        country: 'Brasil',
        relationship: 'Solteira',
        occupation: 'Professora',
        interests: ['Arte', 'Teatro', 'História'],
        theme: 'classic',
        onlineStatus: 'online',
        friends: [],
        friendRequests: [],
        sentRequests: ['user-1'],
        communities: [1],
        emailNotifications: true,
        blockedUserIds: [],
    },
     'user-6': {
        id: 'user-6',
        name: 'Fernando Meireles',
        profilePicUrl: 'https://i.pravatar.cc/150?u=6',
        avatarUrl: 'https://i.pravatar.cc/150?u=6',
        bannerUrl: 'https://picsum.photos/id/137/800/200',
        email: 'fernando.m@example.com',
        dob: '1976-03-30',
        city: 'Salvador',
        country: 'Brasil',
        relationship: 'Casado',
        occupation: 'Músico',
        interests: ['Praia', 'Comida Baiana', 'Violão'],
        theme: 'classic',
        onlineStatus: 'away',
        friends: [],
        friendRequests: ['user-2'],
        sentRequests: [],
        communities: [2],
        emailNotifications: true,
        blockedUserIds: [],
    }
};

// COMMUNITIES
export const MOCK_COMMUNITIES: Community[] = [
    { id: 1, name: 'Eu Odeio Acordar Cedo', imageUrl: 'https://picsum.photos/seed/community1/200/200', members: 12543, theme: 'classic' },
    { id: 2, name: 'Amantes de Churrasco', imageUrl: 'https://picsum.photos/seed/community2/200/200', members: 8765, theme: 'dark' },
    { id: 3, name: 'Jardinagem para Iniciantes', imageUrl: 'https://picsum.photos/seed/community3/200/200', members: 4321, theme: 'green' },
];

// POSTS
export const MOCK_POSTS: Post[] = [
    {
        id: 1, authorId: 'user-2',
        content: 'Fim de semana no Rio de Janeiro foi incrível! ☀️ #errejota',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        likedByIds: ['user-1', 'user-4'],
        comments: [
            { id: 1, authorId: 'user-1', content: 'Que legal, Bruno! Boas fotos!', timestamp: new Date(Date.now() - 86400000 * 0.9).toISOString() }
        ],
        linkPreview: null,
        imageUrls: [
            'https://picsum.photos/seed/rio1/600/400',
            'https://picsum.photos/seed/rio2/600/400'
        ]
    },
    {
        id: 2, authorId: 'user-3',
        content: 'Terminei de ler "Cem Anos de Solidão". Que livro fantástico! Recomendo a todos.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        likedByIds: ['user-1'],
        comments: [],
        linkPreview: null,
        imageUrls: []
    },
    {
        id: 3, authorId: 'user-1',
        content: 'Pessoal, olhem essa receita de bolo de chocolate que achei! Parece deliciosa. https://www.youtube.com/watch?v=example',
        timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        likedByIds: ['user-2', 'user-3'],
        comments: [],
        linkPreview: null, // App.tsx will generate this
        imageUrls: []
    }
];

// SCRAPS
export const MOCK_SCRAPS: Scrap[] = [
    { id: 1, authorId: 'user-2', recipientId: 'user-1', content: 'E aí, Ana! Tudo bem?', timestamp: 'ontem', orkutedByIds: [] },
    { id: 2, authorId: 'user-3', recipientId: 'user-1', content: 'Amiga, vamos marcar aquele café!', timestamp: '2 dias atrás', orkutedByIds: ['user-1'] },
];

// TESTIMONIALS
export const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: 1, authorId: 'user-4', recipientId: 'user-1', content: 'Ana é uma pessoa incrível, sempre disposta a ajudar. Uma grande amiga!', approved: true, orkutedByIds: ['user-2'] },
    { id: 2, authorId: 'user-2', recipientId: 'user-1', content: 'Conheço a Ana há anos, uma profissional e tanto.', approved: false, orkutedByIds: [] },
];

// CHAT MESSAGES
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, senderId: 'user-2', recipientId: 'user-1', content: 'Oi Ana, tudo certo?', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), read: true },
    { id: 2, senderId: 'user-1', recipientId: 'user-2', content: 'Oi Bruno! Tudo ótimo por aqui. E com você?', timestamp: new Date(Date.now() - 60000 * 4).toISOString(), read: true },
    { id: 3, senderId: 'user-2', recipientId: 'user-1', content: 'Tudo bem também. Viu o jogo ontem?', timestamp: new Date(Date.now() - 60000 * 3).toISOString(), read: false },
    { id: 4, senderId: 'user-3', recipientId: 'user-1', content: 'Amiga, preciso te contar uma coisa!', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
];

// ALBUMS & PHOTOS
export const MOCK_ALBUMS: Album[] = [
    {
        id: 'album-1', name: 'Viagem para a Praia', photos: [
            { id: 'photo-1', url: 'https://picsum.photos/seed/beach1/400/400', name: 'praia-01.jpg', uploadDate: new Date().toISOString() },
            { id: 'photo-2', url: 'https://picsum.photos/seed/beach2/400/400', name: 'praia-02.jpg', uploadDate: new Date().toISOString() },
        ]
    },
    { id: 'album-2', name: 'Aniversário', photos: [] }
];

// PLAYLISTS & VIDEOS
export const MOCK_PLAYLISTS: Playlist[] = [
    {
        id: 'playlist-1', name: 'Vídeos de Férias', videos: [
             { id: 'video-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnailUrl: 'https://picsum.photos/seed/video1/300/200', name: 'coelhos.mp4', uploadDate: new Date().toISOString() }
        ]
    }
];

// PROFILE VISITS
export const MOCK_PROFILE_VISITS: ProfileVisit[] = [
    { visitorId: 'user-2', visitedId: 'user-1', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
    { visitorId: 'user-3', visitedId: 'user-1', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
    { visitorId: 'user-4', visitedId: 'user-1', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
];

// NOTIFICATIONS
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    recipientId: 'user-1',
    actorId: 'user-3',
    type: 'new_like',
    targetId: 3, // Post about the recipe
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    recipientId: 'user-2', // Belongs to another user, should not be visible to user-1
    actorId: 'user-1',
    type: 'new_comment',
    targetId: 1, // Post about Rio
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
   {
    id: 3,
    recipientId: 'user-1', // This is a friend request, should be visible
    actorId: 'user-5',
    type: 'friend_request',
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
];