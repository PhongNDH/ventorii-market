import { axiosClient } from './config';

export const listedNFT = async () => {
  return await axiosClient.get('/market/listed');
};

export const refreshOwner = async (data: any) => {
  return await axiosClient.post('/market/refresh-owner', data);
};

export const refreshListing = async (data: any) => {
  return await axiosClient.post('/market/refresh-listing', data);
};

export const refreshPrice = async (data: any) => {
  return await axiosClient.post('/market/refresh-price', data);
};
