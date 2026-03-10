import { dayjs } from './dayjs';

/**
 * Helper function to safely fetch data with caching and rate limiting.
 * Implements caching to avoid repeated API calls and handles rate limiting by enforcing a 1 hour cooldown between fetches.
 * If data exists in cache, returns it directly. Otherwise attempts to fetch new data if cooldown period has elapsed.
 * Handles errors gracefully by caching failed attempts to prevent retry spam.
 *
 * @param rule - The rule object containing parameters for the fetch
 * @param cache - Cache object to store fetched data
 * @param fetchFun - Async function that performs the actual data fetch
 * @param saveCache - Function to save updated cache data
 * @param fieldKey - Key in cache object where fetched data should be stored
 * @returns Promise<boolean> - Returns true if data is available (either freshly fetched or from cache), false otherwise
 */
export async function safeFetch({
  rule,
  cache,
  fetchFun,
  saveCache,
  fieldKey,
}: {
  rule: any;
  cache: any;
  fetchFun: () => Promise<any>;
  saveCache: (rule: any, cache: any) => Promise<void>;
  fieldKey: string;
}) {
  if (!cache[fieldKey]) {
    if (
      !cache.lastFetched ||
      dayjs().diff(dayjs(cache.lastFetched), 'hour') >= 1
    ) {
      try {
        const fieldValue = await fetchFun();
        cache[fieldKey] = fieldValue;
        cache.lastFetched = dayjs().toISOString();
        await saveCache(rule, cache);
        return true;
      } catch (error) {
        console.warn(
          `WARNING: safeFetch() encountered an error. Please reach out to the development team for assistance: ${error}`
        );

        cache[fieldKey] = null;
        cache.lastFetched = dayjs().toISOString();
        await saveCache(rule, cache);
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
}
