import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from the API.
 * Returns { data, loading, error } and uses fallback data if the API fails.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {*} fallbackData - Data to use if the API call fails
 * @param {Array} deps - Dependency array for re-fetching
 */
export function useApi(fetchFn, fallbackData = null, deps = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('API fetch failed, using fallback data:', err.message);
          setError(err.message);
          // Keep fallback data — graceful degradation
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
