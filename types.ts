// Fix: Define the data structures for the application.
export interface User {
  id: number;
  name: string;
  profilePicUrl: string;
  city: string;
  country: string;
  relationship: string;
  occupation: string;
  interests: string[];
  friends: number[]; // array of user ids
  friendRequests: number[]; // array of user ids (INCOMING)
  sentRequests: number[]; // array of user ids (OUTGOING)
  communities: number[]; // array of community ids
}

export interface Scrap {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
}

export interface Testimonial {
  id: number;
  authorId: number;
  content: string;
  approved: boolean;
}

export interface Community {
  id: number;
  name: string;
  imageUrl: string;
  members: number;
}