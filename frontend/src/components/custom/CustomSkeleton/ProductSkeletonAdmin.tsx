import { Skeleton } from 'antd';
import React from 'react';

const ProductSkeletonAdmin = () => {
  return (
    <div className='w-full flex items-start bg-layer-2 rounded-lg p-2 gap-[1rem]'>
      <Skeleton.Button
        shape='square'
        active
        className='aspect-square basis-1/4 rounded-lg skeleton-image'
        block
      />
      <div className='space-y-2 basis-3/4'>
        <div className='w-full'>
          <Skeleton.Button size='small' active block />
        </div>
        <div className='w-4/6'>
          <Skeleton.Button size='small' active block />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeletonAdmin;
