import { setActivity } from './setActivity';
import { EActivity } from '@/utils/constants/formatActivity';
jest.mock('./sendActivities', () => jest.fn());
import sendActivity from './sendActivities';
describe('setActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('calls sendActivity with formatted message', async () => {
    (sendActivity as jest.Mock).mockResolvedValue({});
    const activity = EActivity.BOOK_READ;
    const username = 'user';
    const book = {
      id: 'book-id',
      title: 'Book Title',
      name: 'Book Title',
      series: { name: '', id: 0 },
      cover: { url: '' },
      releaseDate: '',
      pageCount: 0,
      author: {
        id: 0,
        name: '',
        image: { url: '' },
        biography: '',
      },
      description: '',
    };
    const result = await setActivity(activity, username, book, 50, 5);
    expect(sendActivity).toHaveBeenCalled();
    expect(result).toContain('user');
    expect(result).toContain('Book Title');
  });
  it('returns message even if sendActivity throws', async () => {
    (sendActivity as jest.Mock).mockRejectedValue(new Error('Network error'));
    const activity = EActivity.BOOK_READ;
    const username = 'user';
    const book = {
      id: 'book-id',
      title: 'Book Title',
      name: 'Book Title',
      series: { name: '', id: 0 },
      cover: { url: '' },
      releaseDate: '',
      pageCount: 0,
      author: {
        id: 0,
        name: '',
        image: { url: '' },
        biography: '',
      },
      description: '',
    };
    const result = await setActivity(activity, username, book, 50, 5);
    expect(sendActivity).toHaveBeenCalled();
    expect(result).toContain('user');
    expect(result).toContain('Book Title');
  });
});
