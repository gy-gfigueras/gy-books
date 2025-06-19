import { UserData } from './userData.model';

export interface ApiBook {
  id: string;
  averageRating: number;
  userData?: UserData;
}
