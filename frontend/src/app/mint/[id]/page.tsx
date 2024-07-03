'use client';

import CustomImage from '@/components/custom/CustomImage';
import {
  useAccount,
  useContract,
  useContractRead,
  useProvider,
} from '@starknet-react/core';
import React, { useEffect, useState } from 'react';
import CustomButton from '@/components/custom/CustomButton';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { CallData, Contract, cairo } from 'starknet';
import erc721ABI from '@/abi/erc721.json';
import erc20ABI from '@/abi/erc20.json';
import useMounted from '@/hook/useMounted';
import { collectionData } from '@/fetching/client/mint';
import CustomProgress from '@/components/custom/CustomProgress';
import { formatToken } from '@/utils';

const Mint = () => {
  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<any>([]);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);

  useEffect(() => {
    if (!isMounted) return;

    const getHomeData = async () => {
      try {
        const collectionResponse: any = await collectionData();

        const collectionResponseData = collectionResponse?.data?.data;
        setCollection(collectionResponseData[0]);
      } catch (err) {
        toastError('Get Collection Data failed');
        console.log(err);
      }
    };

    getHomeData();
  }, [isMounted]);

  const MINT_PRICE = collection?.mint_price;

  const TOTAL_POOL_MINT = 100;

  // const remainingPool = useContractRead({
  //   functionName: 'get_remaining_mint',
  //   args: [1],
  //   abi: erc721ABI,
  //   address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
  //   watch: true,
  // });

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
  });

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
  });

  const getRemainingPool = async () => {
    const remainingPool = await erc721Contract?.get_remaining_mint(1);
    // console.log('here', Number(remainingPool));
    setRemainingPool(remainingPool);
  };

  useEffect(() => {
    getRemainingPool();
    const interval = setInterval(() => {
      getRemainingPool();
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  const onMint = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const allowance = await erc20Contract?.allowance(
        address,
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string
      );

      const isNeedToApprove = Number(allowance) < MINT_PRICE * 10 ** 18;
      console.log(isNeedToApprove);

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
                    .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
                  amount: cairo.uint256(MINT_PRICE * 10 ** 18),
                }),
              },
            ]),
        {
          contractAddress: process.env
            .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
          entrypoint: 'mint_nft',
          calldata: CallData.compile({
            pool_mint: 1,
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      toastSuccess('Mint success');
      getDcoin();
      getRemainingPool();
      console.log('tx hash', tx);
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='layout-container py-[5rem] max-w-[1000px] my-[3rem]'>
      <div className='flex items-start  gap-[2rem] max-sm:flex-col'>
        <div className='basis-1/2 max-sm:w-full aspect-square border-[2px] border-white rounded-lg relative'>
          <CustomImage src={collection?.image} alt='err' fill />
        </div>
        <div className='basis-1/2 max-sm:w-full flex flex-col'>
          <h1 className='text-[24px] font-[700]'>{collection?.name}</h1>
          <div className='flex items-center justify-between mt-[1rem]'>
            <p>Minted Item</p>
            <p>
              {remainingPool ? TOTAL_POOL_MINT - Number(remainingPool) : 0}/
              {TOTAL_POOL_MINT}
            </p>
          </div>
          <CustomProgress
            showInfo={false}
            percent={
              ((TOTAL_POOL_MINT - Number(remainingPool)) / TOTAL_POOL_MINT) *
              100
            }
          />
          <div className='flex items-center justify-between  mt-[5rem]'>
            <p>Price</p>
            <p>{collection?.mint_price} DCOIN</p>
          </div>
          <CustomButton
            loading={loading}
            onClick={onMint}
            className='btn-primary mt-[1rem]'
          >
            Mint
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Mint;
