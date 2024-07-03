'use client';

import CardMarketplace from '@/components/CardMarketplace';
import CardProfile from '@/components/CardProfile';
import ModalCancelListNFT from '@/components/modal/ModalCancelListNFT';
import ModalListNFT from '@/components/modal/ModalListNFT';
import { profile } from '@/fetching/client/profile';
import useLocalStorageChange from '@/hook/useLocalStorageChange';
import { formatWallet } from '@/utils';
import { toastError } from '@/utils/toast';
import { useAccount } from '@starknet-react/core';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [openModalListNFT, setOpenModalListNFT] = useState(false);
  const [openModalCancelListNFT, setOpenModalCancelListNFT] = useState(false);
  const { address } = useAccount();
  const [profileData, setProfileData] = useState<any>(null);
  const { isExist: isExistTokenInStorage } = useLocalStorageChange({
    key: 'token',
  });
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  const getProfile = async () => {
    try {
      const profileResponse: any = await profile();
      const data = profileResponse?.data?.data;
      console.log(profileResponse);
      setProfileData(data);
    } catch (err) {
      toastError('Get profile failed');
      console.log(err);
    }
  };

  useEffect(() => {
    if (!address || !isExistTokenInStorage) return;

    getProfile();
  }, [address, isExistTokenInStorage]);

  return (
    <div className='layout-container my-[3rem]'>
      <ModalListNFT
        open={openModalListNFT}
        onCancel={() => {
          setOpenModalListNFT(false);
        }}
        data={selectedNFT}
        getProfile={getProfile}
      />
      <ModalCancelListNFT
        open={openModalCancelListNFT}
        onCancel={() => {
          setOpenModalCancelListNFT(false);
        }}
        data={selectedNFT}
        getProfile={getProfile}
      />
      <h1 className='text-[32px] font-[700] mb-[2rem] mt-[5rem]'>Profile</h1>
      <div className='flex items-center gap-[1rem] mb-[3rem]'>
        <p className='text-[24px]'>User: {formatWallet(address)}</p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1rem]'>
        {profileData?.map((item: any) => (
          <div key={item?._id}>
            <CardProfile
              data={item}
              setOpenModalListNFT={setOpenModalListNFT}
              setOpenModalCancelListNFT={setOpenModalCancelListNFT}
              setSelectedNFT={setSelectedNFT}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
