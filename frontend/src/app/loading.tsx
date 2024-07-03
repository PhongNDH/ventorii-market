'use client';

import CustomImage from '@/components/custom/CustomImage';
import React from 'react';

const Loading = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-layer-1'>
      <CustomImage
        src='/images/logo.png'
        alt='loading'
        className='animate-spin'
        width={100}
        height={100}
      />
    </div>
  );
};

export default Loading;
