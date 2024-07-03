import React from 'react';
import CustomImage from './custom/CustomImage';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <div className='flex items-center gap-[0.5rem] text-[28px] font-[700] tracking-wider'>
        <CustomImage
          src={'/images/logo.png'}
          alt='err'
          width={50}
          height={50}
        />
        VENTORII
      </div>
    </Link>
  );
};

export default Logo;
