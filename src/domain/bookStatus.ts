import { EStatus } from '@/utils/constants/EStatus';

export default interface bookStatus {
  status?: EStatus;
  averageRating: number;
  idBook: string;
}
