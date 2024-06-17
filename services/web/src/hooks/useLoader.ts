import { useCallback, useState } from 'react';

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoader = useCallback(async (callback) => {
    setIsLoading(true);
    try {
      await callback();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, withLoader };
};
