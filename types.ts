// Fix: Define the data structures for the application.
export interface User {
  id: number;
  name: string;
  profilePicUrl: string;
  avatarUrl: string;
  email: string;
  password?: string; // Optional as we won't store it for mock users
  dob: string; // YYYY-MM-DD format
  city: string;
  country: string;
  relationship: string;
  occupation: string;
  interests: string[];
  theme: string; // e.g., 'classic', 'pink', 'dark'
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