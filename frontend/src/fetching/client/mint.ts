import { axiosClient } from './config';

export const collectionData = async () => {
  return await axiosClient.get('/market/mint');
};
