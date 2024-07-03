import React from 'react';
import useResponsive from '@/hook/useResponsive';
import Header from './Header';

const LayoutPrimary = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default LayoutPrimary;
