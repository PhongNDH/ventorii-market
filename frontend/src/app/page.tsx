'use client';
import HomeContainer from '@/container/Home';
import HomePageStoreProvider from '@/container/Home/context';

export default function Home() {
  return (
    <HomePageStoreProvider>
      <HomeContainer />
    </HomePageStoreProvider>
  );
}
