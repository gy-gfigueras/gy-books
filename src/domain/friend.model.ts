import { UUID } from 'crypto';

export interface Friend {
  id: UUID;
  username: string;
  phoneNumber: string;
  picture: string;
}

export interface User extends Friend {
  id: UUID;
  username: string;
  phoneNumber: string;
  picture: string;
  isFriend: boolean;
}
