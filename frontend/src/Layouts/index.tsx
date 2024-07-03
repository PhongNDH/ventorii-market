'use client';

import React, { useEffect, useState } from 'react';
import useMounted from '@/hook/useMounted';
import { usePathname } from 'next/navigation';
import LayoutPrimary from './LayoutPrimary';
import LayoutAdmin from './LayoutAdmin';
import Loading from '@/app/loading';

const Layout = ({ children }: any) => {
  const { isMounted } = useMounted();

  const pathName = usePathname();
  const [currentLayout, setCurrentLayout] = useState(
    <LayoutPrimary>{children}</LayoutPrimary>
  );

  useEffect(() => {
    if (pathName === '/admin') {
      setCurrentLayout(<LayoutAdmin>{children}</LayoutAdmin>);
    } else {
      setCurrentLayout(<LayoutPrimary>{children}</LayoutPrimary>);
    }
  }, [pathName]);

  return (
    <>
      {!isMounted && <Loading />}
      {currentLayout}
    </>
  );
};

export default Layout;
