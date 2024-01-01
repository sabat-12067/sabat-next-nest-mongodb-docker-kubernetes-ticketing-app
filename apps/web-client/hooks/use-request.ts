import { useState } from 'react';

const useRequest = <T>(url: URL | RequestInfo, execute = false) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
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
