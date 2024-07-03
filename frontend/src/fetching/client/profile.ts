import { axiosClient } from './config';

export const profile = async () => {
  return await axiosClient.get('/user/profile');
};
