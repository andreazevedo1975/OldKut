// Fix: Provide mock data for the application.
import type { User, Scrap, Testimonial, Community } from './types';

export const MOCK_USERS: { [key: number]: User } = {
  1: {
    id: 1,
    name: 'Ana Silva',
    profilePicUrl: `https://i.pravatar.cc/150?u=1`,
    city: 'São Paulo',
    country: 'Brasil',
    relationship: 'Solteira',
    occupation: 'Designer',
    interests: ['Fotografia', 'Viagens', 'Música Indie'],
    friends: [2, 3],
    friendRequests: [4], // From Daniel
    sentRequests: [],
    communities: [101, 102],
  },
  2: {
    id: 2,
    name: 'Bruno Costa',
    profilePicUrl: `https://i.pravatar.cc/150?u=2`,
    city: 'Rio de Janeiro',
    country: 'Brasil',
    relationship: 'Namorando',
    occupation: 'Desenvolvedor',
    interests: ['Jogos', 'Filmes', 'Tecnologia'],
    friends: [1],
    friendRequests: [],
    sentRequests: [],
    communities: [101, 103],
  },
  3: {
    id: 3,
    name: 'Carla Dias',
    profilePicUrl: `https://i.pravatar.cc/150?u=3`,
    city: 'Belo Horizonte',
    country: 'Brasil',
    relationship: 'Casada',
    occupation: 'Médica',
    interests: ['Leitura', 'Culinária', 'Ioga'],
    friends: [1],
    friendRequests: [],
    sentRequests: [],
    communities: [102],
  },
  4: {
    id: 4,
    name: 'Daniel Rocha',
    profilePicUrl: `https://i.pravatar.cc/150?u=4`,
    city: 'Salvador',
    country: 'Brasil',
    relationship: 'Solteiro',
    occupation: 'Músico',
    interests: ['Praia', 'Surf', 'Violão'],
    friends: [],
    friendRequests: [],
    sentRequests: [1], // To Ana
    communities: [103],
  }
};

export const MOCK_SCRAPS: Scrap[] = [
    { id: 1, authorId: 2, content: 'E aí, tudo bem? Adorei suas fotos novas!', timestamp: 'Hoje' },
    { id: 2, authorId: 3, content: 'Passando pra deixar um oi! :)', timestamp: 'Ontem' },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: 1, authorId: 2, content: 'A Ana é uma pessoa incrível, super talentosa e uma ótima amiga. Recomendo!', approved: true },
    { id: 2, authorId: 3, content: 'Uma profissional fantástica e uma pessoa maravilhosa. Adoro trabalhar com ela!', approved: false },
];

export const MOCK_COMMUNITIES: { [key: number]: Community } = {
    101: { id: 101, name: 'Eu odeio acordar cedo', imageUrl: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=C', members: 123456 },
    102: { id: 102, name: 'Amantes de Café', imageUrl: 'https://via.placeholder.com/50/8B4513/FFFFFF?text=C', members: 78901 },
    103: { id: 103, name: 'Desenvolvedores BR', imageUrl: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=C', members: 54321 },
};