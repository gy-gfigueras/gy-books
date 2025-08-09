/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function getStats(profileId: string): Promise<any> {
  try {
    const response = await fetch(
      `/api/public/accounts/${profileId}/books/stats`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching stats:', errorText);
      throw new Error(errorText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getStats:', error);
    throw new Error(
      `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
