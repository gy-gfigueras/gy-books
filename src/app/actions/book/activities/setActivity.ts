'use server';

import formatActivity, { EActivity } from '@/utils/constants/formatActivity';
import sendActivity from './sendActivities';
import Book from '@/domain/book.model';

export const setActivity = async (
  activity: EActivity,
  username: string,
  book: Book,
  progress?: number,
  rating?: number
) => {
  const formData = new FormData();
  const message = formatActivity(activity, username, book, progress, rating);
  formData.append('message', message);
  try {
    await sendActivity(formData);
  } catch (error) {
    console.error('Error formatting activity:', error);
  }
  return message;
};
