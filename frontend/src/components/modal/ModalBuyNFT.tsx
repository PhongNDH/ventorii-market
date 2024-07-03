import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { formatWallet } from '@/utils';
import useCopyToClipboard from '@/context/useCopyToClipboard';
import CustomTooltip from '../custom/CustomTooltip';
import IconCopy from '@/assets/icons/IconCopy';
import { useStore } from '@/context/store';
import { CallData, Contract, cairo } from 'starknet';
import { toastError, toastSuccess } from '@/utils/toast';
import {
  listedNFT,
  refreshListing,
  refreshOwner,
} from '@/fetching/client/home';

const ModalBuyNFT = ({ open, onCancel, selectedNFT }: any) => {
  const [text, copy] = useCopyToClipboard();

  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const { setListedNFTData } = useStore();

  const TOKEN_ID = selectedNFT?.token_id;
  const NFT_PRICE = selectedNFT?.price;

  const onBuy = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string
      );

      const erc20Contract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
        provider
      );

      const allowance = await erc20Contract.allowance(
        address,
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string
      );

      const isNeedToApprove = Number(allowance) < NFT_PRICE;

      const tx = await account?.execute([
        ...(!isNeedToApprove
          ? []
          : [
              {
                contractAddress: process.env
                  .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
                entrypoint: 'approve',
                calldata: CallData.compile({
                  spender: process.env
                    .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
                  amount: cairo.uint256(NFT_PRICE * 10 ** 18),
                }),
              },
            ]),
        {
          contractAddress: process.env
            .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
          entrypoint: 'buy_nft',
          calldata: CallData.compile({
            token_id: cairo.uint256(TOKEN_ID),
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      getDcoin();
      await refreshOwner({ token_id: TOKEN_ID }); // to get newest profile
      await refreshListing({ token_id: TOKEN_ID }); // to get newest listed nft
      const newListedNfts = await listedNFT();
      setListedNFTData(newListedNfts?.data?.data);
      toastSuccess('Buy success!');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('Buy failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal width={435} open={open} onCancel={onCancel}>
      <div className='p-4 md:p-8 '>
        <h4 className='text-xl text-white font-medium mb-4'>Checkout</h4>
        <p className='text-secondary text-base'>You decide to buy</p>

        <div className='overflow-y-auto scrollbar-custom max-h-[80vh]'>
          <div className='text-white flex justify-between items-center space-x-2 py-8 border-b border-solid border-stroke'>
            <CustomImage
              src={selectedNFT?.image}
              alt='nft'
              width={50}
              height={50}
              className='rounded-lg'
            />
            <div className='flex-1 flex flex-col justify-between truncate'>
              <span className='text-lg font-medium truncate'>
                {selectedNFT?.name}
              </span>
              <div className='flex items-center space-x-2'>
                <IconVerified />
                <span className='text-secondary text-sm font-medium truncate'>
                  Ventorii x Meme Land Potatoz
                </span>
              </div>
            </div>
            <div className='space-x-1 flex items-center'>
              <span className='text-sm '>{selectedNFT?.price} DCOIN</span>
            </div>
          </div>
          <div className='border-b border-solid border-stroke pb-5'>
            <div className='mt-5'>
              <p className='text-secondary text-base'>Your wallet:</p>
              <div className='bg-layer-2 rounded-lg p-4 flex items-center space-x-2 mt-5'>
                <div className='text-lg flex items-center gap-[1rem]'>
                  {/* <span className="text-secondary">{getCurrency.currency}</span> */}
                  <div className='text-white flex items-center font-medium space-x-2'>
                    {formatWallet(address)}
                  </div>
                  <CustomTooltip
                    title='Copied'
                    placement='right'
                    trigger={['click']}
                  >
                    <IconCopy
                      className='cursor-pointer'
                      onClick={() => copy(address as string)}
                    />
                  </CustomTooltip>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between text-white mt-4'>
            <span>You will pay</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              {selectedNFT?.price} DCOIN
            </div>
          </div>
        </div>

        <div className='flex items-center mt-5 gap-[1rem]'>
          <CustomButton onClick={onCancel} className='btn-secondary basis-1/2'>
            Cancel
          </CustomButton>
          <CustomButton
            onClick={onBuy}
            className='btn-primary basis-1/2'
            loading={loading}
          >
            Buy Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalBuyNFT;
