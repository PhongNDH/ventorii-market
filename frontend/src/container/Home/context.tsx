'use client';

import { createContext, useContext, useState } from 'react';

const storeContext = createContext<any>(null);

export const useHomePageStore = () => useContext(storeContext);

const HomePageStoreProvider = ({ children }: any) => {
  const [userLoginData, setUserLoginData] = useState<any>(true);

  return (
    <storeContext.Provider
      value={{
        userLoginData,
        setUserLoginData,
      }}
    >
      {children}
    </storeContext.Provider>
  );
};
export default HomePageStoreProvider;
