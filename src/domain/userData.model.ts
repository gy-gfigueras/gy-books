import { EStatus } from '@/utils/constants/EStatus';

export interface UserData {
  userId: string;
  status: EStatus;
  rating: number;
  startDate: string;
  endDate: string;
}
