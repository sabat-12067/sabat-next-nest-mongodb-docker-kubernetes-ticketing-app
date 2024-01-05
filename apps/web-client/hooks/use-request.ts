import { useState } from 'react';

interface FetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useRequest = <T>(
  url: string | URL,
  execute = false
): FetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: T = await response.json();
      setData(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (execute) {
    fetchData();
  }

  return { data, loading, error, refetch: fetchData };
};

export default useRequest;
