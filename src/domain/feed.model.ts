import { UUID } from 'crypto';

export interface FeedActivity {
  id: UUID;
  profileId: UUID;
  message: string;
  date: string;
  likes: UUID[];
  bookId?: string;
}

export interface FeedResponse {
  feed: FeedActivity[];
}
