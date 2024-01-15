import ky from 'ky';
import type { HTTPError } from 'ky';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

const api = ky.extend({});

interface FetchResponse<T> {
  data: T | null;
  loading: boolean;
  errors: Array<string> | null;
  refetch: (props?: object) => void;
}

interface Props {
  path: string | URL;
  execute?: boolean;
  method: string;
  body?: object | null;
  onSuccess?: (param: any) => Promise<boolean>;
}

const useRequest = <T>({
  path,
  execute = false,
  method = 'get',
  body,
  onSuccess,
}: Props): FetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState<Array<string> | null>(null);
  const { data: session } = useSession();

  const fetchData = useCallback(
    async (props = {}) => {
      try {
        setLoading(true);
        let json = { ...body, ...props };
        if (method === 'get') {
          json = undefined;
        }
        const response: T = await api(`https://ticketing.dev/api${path}`, {
          method,
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
          json,
        }).json();

        setData(response);
        if (onSuccess) {
          onSuccess(response);
        }
      } catch (error: any) {
        console.error(error);

        if (error?.response) {
          const jsonError = await error.response.json();
          setError([jsonError.message].flat());
        } else {
          setError([error.message]);
        }
      } finally {
        setLoading(false);
      }
    },
    [body, method, onSuccess, session?.access_token, path]
  );

  useEffect(() => {
    if (execute) {
      fetchData().catch(console.error);
    }
  }, [execute, fetchData]);

  return { data, loading, errors, refetch: fetchData };
};

export default useRequest;
