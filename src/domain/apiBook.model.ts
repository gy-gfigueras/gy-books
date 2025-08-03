import { UserData } from './userData.model';

export interface Book {
  id: string;
}

export interface ApiBook extends Book {
  id: string;
  averageRating: number;
  userData?: UserData;
}
