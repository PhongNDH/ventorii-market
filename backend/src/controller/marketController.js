import { Account, Contract, RpcProvider } from 'starknet';
import { collectionModel } from '../models/collectionModel.js';
import { nftModel } from '../models/nftModel.js';
import { feltToStr } from '../utils/index.js';

export const listed = async (req, res) => {
  try {
    const marketData = await nftModel.find({
      listing: true,
    });
    /* Done */
    res.status(200).json({
      message: 'Get listed NFT success',
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const mint = async (req, res) => {
  try {
    /* fake data */
    /*  await collectionModel.create({
      collection_address:
        '0x00a01c352fd150d184835c727a84adfaf047838271e8641da6ea5156f7f73dce',
      name: 'Meme Land',
      image: 'https://grow-api.memeland.com/token/images/5.gif',
      mint_price: '1',
    }); */
    // await nftModel.deleteMany({ listing: true });
    const collectionData = await collectionModel.find({});
    /* Done */
    res.status(200).json({
      message: 'Get collection data success',
      data: collectionData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const refreshOwner = async (req, res) => {
  try {
    const { token_id } = req.body;

    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
    });
    const account = new Account(
      provider,
      process.env.ACCOUNT_ADDRESS,
      process.env.PRIVATE_KEY,
    );
    const { abi } = await provider.getClassAt(process.env.NFT_CONTRACT);
    const nftContract = new Contract(abi, process.env.NFT_CONTRACT, account);
    const owner = await nftContract.ownerOf(token_id);
    const address = '0x' + owner.toString(16);

    await nftModel.updateOne(
      { token_id },
      { owner: address }, // decimal to hex
    );
    /* Done */
    res.status(200).json({
      message: 'Refresh owner success',
      data: {
        token_id,
        owner: address.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const refreshListingStatus = async (req, res) => {
  try {
    const { token_id } = req.body;

    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
    });
    const account = new Account(
      provider,
      process.env.ACCOUNT_ADDRESS,
      process.env.PRIVATE_KEY,
    );
    const { abi } = await provider.getClassAt(process.env.NFT_CONTRACT);
    const nftContract = new Contract(abi, process.env.NFT_CONTRACT, account);
    const owner = await nftContract.ownerOf(token_id);
    const address = '0x0' + owner.toString(16);
    const listingStatus = address === process.env.MARKET_CONTRACT;

    console.log(process.env.MARKET_CONTRACT, address);

    await nftModel.updateOne(
      { token_id },
      { listing: listingStatus }, // decimal to hex
    );
    /* Done */
    res.status(200).json({
      message: 'Refresh listing status success',
      data: {
        token_id,
        listingStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const refreshPrice = async (req, res) => {
  try {
    const { token_id } = req.body;

    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
    });
    const account = new Account(
      provider,
      process.env.ACCOUNT_ADDRESS,
      process.env.PRIVATE_KEY,
    );
    const { abi } = await provider.getClassAt(process.env.MARKET_CONTRACT);
    const marketContract = new Contract(
      abi,
      process.env.MARKET_CONTRACT,
      account,
    );
    const price = await marketContract.get_nft_price(token_id);
    const formattedPrice = Number(price) / 10 ** 18;

    await nftModel.updateOne({ token_id }, { price: formattedPrice });
    /* Done */
    res.status(200).json({
      message: 'Refresh price success',
      data: {
        token_id,
        price: formattedPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};
