// Fix: Define the data structures for the application.
export interface User {
  id: number;
  name: string;
  profilePicUrl: string;
  avatarUrl:string;
  bannerUrl: string;
  email: string;
  password?: string; // Optional as we won't store it for mock users
  dob: string; // YYYY-MM-DD format
  city: string;
  country: string;
  relationship: string;
  occupation: string;
  interests: string[];
  theme: string; // e.g., 'classic', 'pink', 'dark'
  onlineStatus: 'online' | 'away' | 'offline';
  friends: number[]; // array of user ids
  friendRequests: number[]; // array of user ids (INCOMING)
  sentRequests: number[]; // array of user ids (OUTGOING)
  communities: number[]; // array of community ids
  blockedUserIds: number[]; // array of user ids
}

export interface Scrap {
  id: number;
  authorId: number;
  recipientId: number;
  content: string;
  timestamp: string;
  orkutedByIds: number[]; // array of user ids who liked this
}

export interface Testimonial {
  id: number;
  authorId: number;
  recipientId: number;
  content: string;
  approved: boolean;
  orkutedByIds: number[]; // array of user ids who liked this
}

export interface Community {
  id: number;
  name: string;
  imageUrl: string;
  members: number;
}

export interface ChatMessage {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string; // ISO String
    read: boolean;
}

export interface PostComment {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
}

export interface Post {
  id: number;
  authorId: number;
  content: string;
  timestamp: string; // ISO string or relative time string
  likedByIds: number[];
  comments: PostComment[];
}