import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';

import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';

import { useAccount, useProvider } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { Contract } from 'starknet';
import { listedNFT, refreshListing } from '@/fetching/client/home';
import { usePathname } from 'next/navigation';

const ModalCancelListNFT = ({ open, onCancel, data, getProfile }: any) => {
  const { isConnected, account, address } = useAccount();
  const { connectWallet, setListedNFTData } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const TOKEN_ID = data?.token_id;

  const onUnList = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string
      );
      const marketContract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
        provider
      );
      marketContract.connect(account as any);
      const tx = await marketContract.cancel_listing(TOKEN_ID);
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await refreshListing({ token_id: TOKEN_ID });
      path.includes('/profile') && (await getProfile());
      if (path === '/') {
        const newListedNfts = await listedNFT();
        setListedNFTData(newListedNfts?.data?.data);
      }
      toastSuccess('Cancel List success');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('Cancel List failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal width={435} open={open} onCancel={onCancel}>
      <div className='p-4 md:p-8 '>
        <h4 className='text-xl text-white font-medium mb-4'>Cancel List</h4>

        <div className='overflow-y-auto scrollbar-custom max-h-[80vh]'>
          <div className='text-white flex justify-between items-center space-x-2 pb-8 pt-2 border-b border-solid border-stroke'>
            <CustomImage
              src={data?.image}
              alt='nft'
              width={50}
              height={50}
              className='rounded-lg'
            />
            <div className='flex-1 flex flex-col justify-between truncate'>
              <span className='text-lg font-medium truncate'>{data?.name}</span>
              <div className='flex items-center space-x-2'>
                <IconVerified />
                <span className='text-secondary text-sm font-medium truncate'>
                  Ventorii x Meme Land Potatoz
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between text-white mt-4'>
            <span>Fee</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              0 DCOIN
            </div>
          </div>
        </div>

        <div className='flex items-center mt-5 gap-[1rem]'>
          <CustomButton onClick={onCancel} className='btn-secondary basis-1/2'>
            Close
          </CustomButton>
          <CustomButton
            loading={loading}
            onClick={onUnList}
            className='btn-primary basis-1/2'
          >
            Confirm
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalCancelListNFT;
