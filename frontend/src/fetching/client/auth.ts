import { axiosClient } from './config';

export const login = async (data: any) => {
  return await axiosClient.post('/user/login', data);
};
