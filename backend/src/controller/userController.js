import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { userModel } from '../models/userModel.js';
import { nftModel } from '../models/nftModel.js';
import { getToken } from '../utils/index.js';

export const login = async (req, res) => {
  try {
    /* Save Address */
    const { address } = req.body;
    const existUser = await userModel.findOne({ address }).exec();
    if (existUser) {
      console.log('Address is already exist');
    } else {
      await userModel.create({
        address,
      });
      console.log('Added address', address);
    }
    /* Render JWT */
    const token = jwt.sign(
      {
        data: existUser || address,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '365d',
      },
    );
    /* Done */
    res.status(200).json({
      message: 'Login success',
      data: {
        address: existUser ? existUser.address : address,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const profile = async (req, res) => {
  try {
    /* Fake data */
    /* await nftModel.create({
      token_id: '5',
      collection_address:
        '0x00a01c352fd150d184835c727a84adfaf047838271e8641da6ea5156f7f73dce',
      owner:
        '0x07c78deb47d082c21a473528bac457d121632c713ae13ff2f638a03e20bc89df',
      name: 'Potatoz #5',
      image: 'https://grow-api.memeland.com/token/images/5.gif',
      listing: true,
      price: '0.3',
    }); */
    /* Decode JWT */
    const token = getToken(req);
    const decodeData = jwtDecode(token);
    const address = decodeData.data.address;
    const userData = await nftModel.find({ owner: address.toLowerCase() });
    /* Done */
    res.status(200).json({
      message: 'Get profile success',
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};
