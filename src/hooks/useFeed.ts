/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FeedActivity } from '@/domain/feed.model';

// Mock data - uncomment for testing
/*
const MOCK_FEED: FeedActivity[] = [
  {
    id: '86825dda-12bf-46f8-a0d5-720b51167c6a' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427522] ToxYc has reviewed "Rhythm of War" by Brandon Sanderson: "Final increíble que te revienta como todos los anteriores del archivo, un libro increíble, que quizá sea el mejor de toda la saga hasta ahora."',
    date: '2025-12-22T19:24:12.212+00:00',
    bookId: '427522',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'e45ed827-1df9-44ce-be47-4295b72efe32' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427522] ToxYc has made progress (30%) on "Rhythm of War" by Brandon Sanderson.',
    date: '2025-12-21T18:59:18.827+00:00',
    bookId: '427522',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'f2a8c9d4-5e1b-4f3a-9d2c-8b7e6a5f4c3d' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[135725] luciav7 has reviewed "Shadows of Self" by Brandon Sanderson: "Me ha encantado esta segunda parte de la Era 2, Wax y Wayne son personajes increíbles y la trama me mantuvo en tensión todo el tiempo. Brandon nunca decepciona con el Cosmere."',
    date: '2025-12-18T10:37:15.430+00:00',
    bookId: '135725',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: 'f89a7a70-e709-44f0-8b07-adccad14bc14' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[750370] luciav7 has given a rating of 5 stars to "Twisted Lies" by Ana Huang.',
    date: '2025-12-18T10:37:33.278+00:00',
    bookId: '750370',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '3b8f02e3-240c-49c9-b39a-fb2561a6c97f' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[750370] luciav7 has finished reading "Twisted Lies" by Ana Huang.',
    date: '2025-12-18T10:37:32.284+00:00',
    bookId: '750370',
    likes: [],
  },
  {
    id: 'da96fd7f-3efd-4b13-93dd-d3aca7720114' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[135725] luciav7 has given a rating of 5 stars to "Shadows of Self" by Brandon Sanderson.',
    date: '2025-12-18T10:36:50.830+00:00',
    bookId: '135725',
    likes: [
      'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
      'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    ],
  },
  {
    id: '00e36be5-b4fd-437b-81fb-4d5c8bc9635d' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[135725] luciav7 has finished reading "Shadows of Self" by Brandon Sanderson.',
    date: '2025-12-18T10:36:49.888+00:00',
    bookId: '135725',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '9f4177e0-edcd-45ad-a549-c06b3f6d5826' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427522] ToxYc has made progress (20%) on "Rhythm of War" by Brandon Sanderson.',
    date: '2025-12-08T01:00:52.986+00:00',
    bookId: '427522',
    likes: [],
  },
  {
    id: '50f38483-1996-4640-a30f-04c85c54f94a' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427522] ToxYc has made progress (10%) on "Rhythm of War" by Brandon Sanderson.',
    date: '2025-12-08T00:21:08.653+00:00',
    bookId: '427522',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: '2a5ea40c-9588-4ce7-8592-ac58c79315f6' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (70%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-10-27T18:56:20.023+00:00',
    bookId: '459452',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: '2898b4a4-f89a-42b1-b0e4-062a474efa77' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (60%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-10-24T17:13:44.932+00:00',
    bookId: '459452',
    likes: [],
  },
  {
    id: '5921ada8-3b9f-414f-9e9e-2ed7c9533293' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (50%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-10-15T22:06:51.681+00:00',
    bookId: '459452',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'e7701755-2a7d-414b-a939-06dff9785398' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[135725] luciav7 has made progress (245 pages) on "Shadows of Self: A Mistborn Novel" by Brandon Sanderson.',
    date: '2025-10-09T14:28:44.565+00:00',
    bookId: '135725',
    likes: [],
  },
  {
    id: '9a71ec90-3027-4ab2-a9ed-d8d8d40937f4' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (40%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-10-14T12:43:12.091+00:00',
    bookId: '459452',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'a304fbaa-a89d-44e6-b43b-46c7a1f7ecf0' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (30%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-10-05T13:47:52.195+00:00',
    bookId: '459452',
    likes: [],
  },
  {
    id: 'ae436f5c-3f44-442e-9cd1-a0f5c6e31acd' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has made progress (10%) on "Oathbringer" by Brandon Sanderson.',
    date: '2025-09-24T16:09:34.742+00:00',
    bookId: '459452',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'a5da0f6d-15fd-4678-8cd7-0bc69acdecdb' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[80765] ToxYc has given a rating of 4 stars to "Arcanum Unbounded: The Cosmere Collection" by Brandon Sanderson.',
    date: '2025-09-10T17:33:27.804+00:00',
    bookId: '80765',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'c817f51b-e4a6-4054-b2e6-847a96a823b0' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[80765] ToxYc has finished reading "Arcanum Unbounded: The Cosmere Collection" by Brandon Sanderson.',
    date: '2025-09-10T17:33:26.879+00:00',
    bookId: '80765',
    likes: [],
  },
  {
    id: 'b5b3d0b0-c00b-41e9-9138-3d0fb8ffcfd2' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[459452] ToxYc has started reading "Oathbringer" by Brandon Sanderson.',
    date: '2025-09-10T17:33:57.469+00:00',
    bookId: '459452',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: '0f33ea85-3f29-4e18-837d-9e01bab6c3a8' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427544] ToxYc has given a rating of 3.5 stars to "Edgedancer" by Brandon Sanderson.',
    date: '2025-09-10T17:31:45.449+00:00',
    bookId: '427544',
    likes: [],
  },
  {
    id: '00b4d2eb-7098-47e9-b845-9abbc6f6187e' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[427544] ToxYc has finished reading "Edgedancer" by Brandon Sanderson.',
    date: '2025-09-10T17:31:42.677+00:00',
    bookId: '427544',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'e5496b72-8622-401d-bed1-2aed1fbb8184' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[374131] ToxYc has given a rating of 5 stars to "Words of Radiance" by Brandon Sanderson.',
    date: '2025-09-06T14:42:18.604+00:00',
    bookId: '374131',
    likes: [
      'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
      'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    ],
  },
  {
    id: '77649218-b085-4dc6-a994-5257d8ac7d35' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[374131] ToxYc has finished reading "Words of Radiance" by Brandon Sanderson.',
    date: '2025-09-06T14:42:16.098+00:00',
    bookId: '374131',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: 'dfb94bd5-34f1-4b1a-92e0-6f28b65eaa8e' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[386446] ToxYc has given a rating of 5 stars to "The Way of Kings" by Brandon Sanderson.',
    date: '2025-08-21T00:15:22.319+00:00',
    bookId: '386446',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: '0847e369-3237-49b0-977b-f9847cfc1245' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[386446] ToxYc has finished reading "The Way of Kings" by Brandon Sanderson.',
    date: '2025-08-21T00:15:19.572+00:00',
    bookId: '386446',
    likes: [],
  },
  {
    id: '3b8f7e2a-9c1d-4a5e-8f6b-2d3c4e5f6a7b' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[714600] luciav7 has reviewed "Fourth Wing" by Rebecca Yarros: "No puedo creer lo mucho que me ha gustado este libro. Los dragones, el romance, la acción... todo es perfecto. Ya estoy esperando el siguiente de la saga con ansias."',
    date: '2025-08-08T19:19:20.506+00:00',
    bookId: '714600',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: 'c7934ad0-fa43-4f3e-8298-142e2c36b23d' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[714600] luciav7 has given a rating of 5 stars to "Fourth Wing" by Rebecca Yarros.',
    date: '2025-08-08T19:18:50.006+00:00',
    bookId: '714600',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '47299c03-440e-4385-9478-b2246bebcdfb' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[714600] luciav7 has finished reading "Fourth Wing" by Rebecca Yarros.',
    date: '2025-08-08T19:18:49.084+00:00',
    bookId: '714600',
    likes: [],
  },
  {
    id: '676041eb-21e9-476a-b1db-0cad248c2c05' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[506421] luciav7 has given a rating of 5 stars to "Haunting Adeline" by H. D. Carlton.',
    date: '2025-08-08T19:28:39.805+00:00',
    bookId: '506421',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '20627bdb-6c1c-429b-828e-6aee3d7d369a' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[506421] luciav7 has finished reading "Haunting Adeline" by H. D. Carlton.',
    date: '2025-08-08T19:28:38.902+00:00',
    bookId: '506421',
    likes: [],
  },
  {
    id: 'f756f70c-6286-43e0-83f0-db8ec81d89e6' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[673229] luciav7 has given a rating of 5 stars to "Un cuento perfecto" by BENAVENT ELISABET.',
    date: '2025-08-08T19:31:35.454+00:00',
    bookId: '673229',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '9103026a-2c82-49b6-ad9c-ecf54156c978' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[673229] luciav7 has finished reading "Un cuento perfecto" by BENAVENT ELISABET.',
    date: '2025-08-08T19:31:34.475+00:00',
    bookId: '673229',
    likes: [],
  },
  {
    id: '286f8727-f489-4dd2-a4b3-6ae2770de678' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[700662] luciav7 has given a rating of 5 stars to "Boulevard" by Flor M. Salvador.',
    date: '2025-08-08T19:34:03.305+00:00',
    bookId: '700662',
    likes: ['b526448f-1c92-4163-afc1-fd00ebff34f1' as any],
  },
  {
    id: '9d8d4746-4923-4132-af05-30dbc5a0abda' as any,
    profileId: 'dfa0987b-f1dd-41df-987e-409e5231c9ff' as any,
    message:
      '[700662] luciav7 has finished reading "Boulevard" by Flor M. Salvador.',
    date: '2025-08-08T19:34:02.413+00:00',
    bookId: '700662',
    likes: [],
  },
  {
    id: 'a6fc9119-f63f-474c-a508-d07249f8c256' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[385491] ToxYc has given a rating of 4 stars to "Warbreaker" by Brandon Sanderson.',
    date: '2025-08-06T22:16:15.158+00:00',
    bookId: '385491',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
  {
    id: '88d39265-ff17-4183-9519-62a8d0cc10d6' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[385491] ToxYc has finished reading "Warbreaker" by Brandon Sanderson.',
    date: '2025-08-06T22:16:12.564+00:00',
    bookId: '385491',
    likes: [],
  },
  {
    id: '926811ac-326e-4bbd-b4b0-8000185f13b9' as any,
    profileId: 'b526448f-1c92-4163-afc1-fd00ebff34f1' as any,
    message:
      '[386446] ToxYc has added "The Way of Kings" by Brandon Sanderson to their want to read list.',
    date: '2025-08-06T22:19:00.527+00:00',
    bookId: '386446',
    likes: ['dfa0987b-f1dd-41df-987e-409e5231c9ff' as any],
  },
];
*/

export const useFeed = () => {
  const [feed, setFeed] = useState<FeedActivity[]>([]);
  const [isLoading] = useState(false);

  const toggleLike = (activityId: string, profileId: string) => {
    setFeed((prevFeed) =>
      prevFeed.map((activity) => {
        if (activity.id !== activityId) return activity;

        const hasLiked = activity.likes.includes(profileId as any);

        if (hasLiked) {
          // Remove like
          return {
            ...activity,
            likes: activity.likes.filter((id) => id !== profileId),
          };
        } else {
          // Add like
          return {
            ...activity,
            likes: [...activity.likes, profileId as any],
          };
        }
      })
    );
  };

  return {
    feed,
    isLoading,
    toggleLike,
  };
};
