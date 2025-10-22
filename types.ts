// Fix: Define the data structures for the application.
export interface User {
  id: string;
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
  friends: string[]; // array of user ids
  friendRequests: string[]; // array of user ids (INCOMING)
  sentRequests: string[]; // array of user ids (OUTGOING)
  communities: number[]; // array of community ids
  blockedUserIds: string[]; // array of user ids
}

export interface Scrap {
  id: number;
  authorId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  orkutedByIds: string[]; // array of user ids who liked this
}

export interface Testimonial {
  id: number;
  authorId: string;
  recipientId: string;
  content: string;
  approved: boolean;
  orkutedByIds: string[]; // array of user ids who liked this
}

export interface Community {
  id: number;
  name: string;
  imageUrl: string;
  members: number;
  theme: string;
}

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
}

export interface ChatMessage {
    id: number;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string; // ISO String
    read: boolean;
    linkPreview?: LinkPreviewData | null;
}

export interface PostComment {
  id: number;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: number;
  authorId: string;
  content: string;
  timestamp: string; // ISO string or relative time string
  likedByIds: string[];
  comments: PostComment[];
  linkPreview?: LinkPreviewData | null;
}

export interface ProfileVisit {
  visitorId: string;
  visitedId: string;
  timestamp: string; // ISO String
}

export interface Notification {
  id: number;
  recipientId: string;
  actorId: string;
  type: 'friend_request' | 'new_like' | 'new_comment';
  targetId?: number; // e.g., post_id
  read: boolean;
  timestamp: string;
}

export interface Photo {
  id: string;
  url: string;
  name: string;
  uploadDate: string; // ISO String
}

export interface Album {
  id: string;
  name: string;
  photos: Photo[];
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl: string;
  subtitle?: {
    url: string;
    name: string;
  };
  name: string;
  uploadDate: string; // ISO String
}

export interface Playlist {
  id: string;
  name: string;
  videos: Video[];
}