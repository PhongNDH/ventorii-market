import mongoose, { Schema, ObjectId } from 'mongoose';

export const nftModel = mongoose.model(
  'nfts',
  new Schema({
    token_id: {
      type: String,
      required: true,
    },
    collection_address: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    listing: {
      type: Boolean,
      required: true,
    },
    price: {
      type: String,
    },
  }),
);
