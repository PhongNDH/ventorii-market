import Link from 'next/link';
import React from 'react';
import CustomImage from './custom/CustomImage';
import { formatToken } from '@/utils';

const CardMint = ({ data }: any) => {
  return (
    <Link href={`/mint/${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS}`}>
      <div className='flex flex-col rounded-lg bg-layer-2 max-w-full cursor-pointer group p-2 border border-solid border-stroke'>
        <div className='overflow-hidden rounded-lg'>
          <div className='aspect-square w-full overflow-hidden relative rounded-lg'>
            <CustomImage
              src={data?.image}
              alt='game'
              fill
              className='w-full h-full object-cover aspect-square rounded-lg group-hover:scale-110 !transition !ease-in-out !duration-200'
            />
          </div>
        </div>
        <div className='flex justify-center items-center mt-2'>
          <div className='flex flex-col w-full'>
            <div className='flex justify-start items-center space-x-1 mb-2'>
              <span className='text-sm text-white font-medium three_dot_1_line'>
                {data?.name}
              </span>
            </div>
            <div className=' bg-layer-3 text-xs font-medium text-secondary rounded-lg text-center py-2 px-3'>
              <div className='flex justify-between mt-1'>
                <div>Price</div>
                <div>
                  {data?.mint_price + " "}
                    
                  DCOIN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardMint;
