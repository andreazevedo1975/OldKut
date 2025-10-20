// Fix: Provide mock data for the application.
import type { User, Scrap, Testimonial, Community, Post, ChatMessage } from './types';

export const MOCK_USERS: { [key: number]: User } = {
  1: {
    id: 1,
    name: 'Ana Silva',
    profilePicUrl: `https://i.pravatar.cc/150?u=1`,
    avatarUrl: `https://i.pravatar.cc/150?u=1`,
    bannerUrl: 'https://picsum.photos/id/1015/800/200',
    email: 'ana.silva@example.com',
    dob: '1978-05-15',
    city: 'São Paulo',
    country: 'Brasil',
    relationship: 'Solteira',
    occupation: 'Designer',
    interests: ['Fotografia', 'Viagens', 'Música Indie'],
    theme: 'classic',
    onlineStatus: 'online',
    friends: [2, 3],
    friendRequests: [4], // From Daniel
    sentRequests: [],
    communities: [101, 102],
    blockedUserIds: [],
  },
  2: {
    id: 2,
    name: 'Bruno Costa',
    profilePicUrl: `https://i.pravatar.cc/150?u=2`,
    avatarUrl: `https://i.pravatar.cc/150?u=2`,
    bannerUrl: 'https://picsum.photos/id/10/800/200',
    email: 'bruno.costa@example.com',
    dob: '1975-11-20',
    city: 'Rio de Janeiro',
    country: 'Brasil',
    relationship: 'Namorando',
    occupation: 'Desenvolvedor',
    interests: ['Jogos', 'Filmes', 'Tecnologia'],
    theme: 'classic',
    onlineStatus: 'away',
    friends: [1],
    friendRequests: [],
    sentRequests: [],
    communities: [101, 103],
    blockedUserIds: [],
  },
  3: {
    id: 3,
    name: 'Carla Dias',
    profilePicUrl: `https://i.pravatar.cc/150?u=3`,
    avatarUrl: `https://i.pravatar.cc/150?u=3`,
    bannerUrl: 'https://picsum.photos/id/1025/800/200',
    email: 'carla.dias@example.com',
    dob: '1980-02-10',
    city: 'Belo Horizonte',
    country: 'Brasil',
    relationship: 'Casada',
    occupation: 'Médica',
    interests: ['Leitura', 'Culinária', 'Ioga'],
    theme: 'classic',
    onlineStatus: 'online',
    friends: [1],
    friendRequests: [],
    sentRequests: [],
    communities: [102],
    blockedUserIds: [],
  },
  4: {
    id: 4,
    name: 'Daniel Rocha',
    profilePicUrl: `https://i.pravatar.cc/150?u=4`,
    avatarUrl: `https://i.pravatar.cc/150?u=4`,
    bannerUrl: 'https://picsum.photos/id/1043/800/200',
    email: 'daniel.rocha@example.com',
    dob: '1982-09-01',
    city: 'Salvador',
    country: 'Brasil',
    relationship: 'Solteiro',
    occupation: 'Músico',
    interests: ['Praia', 'Surf', 'Violão'],
    theme: 'classic',
    onlineStatus: 'offline',
    friends: [],
    friendRequests: [],
    sentRequests: [1], // To Ana
    communities: [103],
    blockedUserIds: [],
  }
};

export const MOCK_SCRAPS: Scrap[] = [
    { id: 1, authorId: 2, recipientId: 1, content: 'E aí, tudo bem? Adorei suas fotos novas!', timestamp: 'Hoje', orkutedByIds: [] },
    { id: 2, authorId: 3, recipientId: 1, content: 'Passando pra deixar um oi! :)', timestamp: 'Ontem', orkutedByIds: [] },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: 1, authorId: 2, recipientId: 1, content: 'A Ana é uma pessoa incrível, super talentosa e uma ótima amiga. Recomendo!', approved: true, orkutedByIds: [] },
    { id: 2, authorId: 3, recipientId: 1, content: 'Uma profissional fantástica e uma pessoa maravilhosa. Adoro trabalhar com ela!', approved: false, orkutedByIds: [] },
];

export const MOCK_COMMUNITIES: { [key: number]: Community } = {
    101: { id: 101, name: 'Eu odeio acordar cedo', imageUrl: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=C', members: 123456 },
    102: { id: 102, name: 'Amantes de Café', imageUrl: 'https://via.placeholder.com/50/8B4513/FFFFFF?text=C', members: 78901 },
    103: { id: 103, name: 'Desenvolvedores BR', imageUrl: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=C', members: 54321 },
};

export const MOCK_POSTS: Post[] = [
    {
        id: 1,
        authorId: 2,
        content: 'Nossa, lembrei daquela vez que a gente foi pra praia e o carro quebrou! Que perrengue, mas que risada que a gente deu depois. Bons tempos!',
        timestamp: '2h atrás',
        likedByIds: [1],
        comments: [
            { id: 1, authorId: 1, content: 'Hahaha nem me fale! Lembro até hoje!', timestamp: '1h atrás' },
        ]
    },
    {
        id: 2,
        authorId: 3,
        content: 'Fazendo aquele bolo de fubá com receita da minha avó. O cheirinho que fica na casa não tem preço. ❤️',
        timestamp: '1 dia atrás',
        likedByIds: [],
        comments: []
    },
    {
        id: 3,
        authorId: 1,
        content: 'Revendo umas fotos antigas aqui... é incrível como o tempo voa. Saudade da época que a nossa maior preocupação era qual fita alugar na locadora pro fim de semana.',
        timestamp: '3 dias atrás',
        likedByIds: [2, 3],
        comments: [
             { id: 2, authorId: 3, content: 'Verdade! E rebobinar a fita antes de devolver senão pagava multa haha', timestamp: '2 dias atrás' },
             { id: 3, authorId: 2, content: 'Eu sempre esquecia!', timestamp: '1 dia atrás' },
        ]
    }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, senderId: 2, recipientId: 1, content: "Oi Ana, tudo bem?", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), read: true },
    { id: 2, senderId: 1, recipientId: 2, content: "Tudo ótimo, Bruno! E com você?", timestamp: new Date(Date.now() - 4 * 60000).toISOString(), read: true },
    { id: 3, senderId: 2, recipientId: 1, content: "Tudo certo por aqui também. Viu o jogo ontem?", timestamp: new Date(Date.now() - 3 * 60000).toISOString(), read: false },
    { id: 4, senderId: 3, recipientId: 1, content: "Amiga, preciso te contar uma coisa!", timestamp: new Date(Date.now() - 10 * 60000).toISOString(), read: true },
    { id: 5, senderId: 1, recipientId: 3, content: "Oii, conta!!", timestamp: new Date(Date.now() - 9 * 60000).toISOString(), read: false },
];


export const PREDEFINED_AVATARS: string[] = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=7',
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=14',
    'https://i.pravatar.cc/150?img=25',
    'https://i.pravatar.cc/150?img=33',
    'https://i.pravatar.cc/150?img=45',
];

export const PREDEFINED_BANNERS: string[] = [
    'https://picsum.photos/id/1018/800/200',
    'https://picsum.photos/id/1041/800/200',
    'https://picsum.photos/id/1050/800/200',
    'https://picsum.photos/id/106/800/200',
    'https://picsum.photos/id/1074/800/200',
    'https://picsum.photos/id/129/800/200',
    'https://picsum.photos/id/137/800/200',
    'https://picsum.photos/id/152/800/200',
];