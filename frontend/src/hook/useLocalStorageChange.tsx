import React, { useEffect, useState } from 'react';
import useMounted from './useMounted';
import { getItemLocalStorage } from '@/utils/localStorage';

const useLocalStorageChange = ({ key }: any) => {
  const [isExist, setIsExist] = useState(
    getItemLocalStorage(key) ? true : false
  );
  const { isMounted } = useMounted();
  useEffect(() => {
    if (isMounted) {
      const handleStorageChange = (event: any) => {
        setIsExist(event.target.localStorage?.[key] ? true : false);
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, isMounted]);

  return { isExist };
};

export default useLocalStorageChange;
