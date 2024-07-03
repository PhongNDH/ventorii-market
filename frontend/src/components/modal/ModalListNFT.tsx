import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import logo from '../../../public/images/logo.png';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import CustomInput from '../custom/CustomInput';
import { useAccount, useProvider } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { CallData, Contract, cairo } from 'starknet';
import { refreshListing, refreshPrice } from '@/fetching/client/home';

const ModalListNFT = ({ open, onCancel, data, getProfile }: any) => {
  const [price, setPrice] = useState('');

  const { isConnected, account, address } = useAccount();
  const { connectWallet } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrice('');
  }, [open]);

  const TOKEN_ID = data?.token_id;

  const onList = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string
      );

      const erc721Contract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
        provider
      );

      const approveStatus = await erc721Contract.getApproved(TOKEN_ID);
      const isNeedToApprove = Number(approveStatus) === 0;

      const tx = await account?.execute([
        ...(!isNeedToApprove
          ? []
          : [
              {
                contractAddress: process.env
                  .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
                entrypoint: 'approve',
                calldata: CallData.compile({
                  to: process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
                  token_id: cairo.uint256(TOKEN_ID),
                }),
              },
            ]),
        {
          contractAddress: process.env
            .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
          entrypoint: 'listing_nft',
          calldata: CallData.compile({
            token_id: cairo.uint256(TOKEN_ID),
            price: cairo.uint256(Number(price) * 10 ** 18),
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      await refreshListing({ token_id: TOKEN_ID });
      await refreshPrice({ token_id: TOKEN_ID });
      await getProfile();
      toastSuccess('List for sale success');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('List for sale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal width={435} open={open} onCancel={onCancel}>
      <div className='p-4 md:p-8 '>
        <h4 className='text-xl text-white font-medium mb-4'>List Items</h4>

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
          <div className='border-b border-solid border-stroke pb-5'>
            <div className='mt-5'>
              <p className='text-secondary text-base mb-[1rem]'>Price:</p>
              <CustomInput
                placeholder='Price'
                pattern='^\d*\.?\d*$'
                value={price}
                onChange={(e: any) => {
                  if (!e.target.value) setPrice('');
                  if (e.target.value && e.target.validity.valid)
                    setPrice(e.target.value);
                }}
              />
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
            Cancel
          </CustomButton>
          <CustomButton
            disabled={price === ''}
            loading={loading}
            onClick={onList}
            className='btn-primary basis-1/2'
          >
            List Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalListNFT;
