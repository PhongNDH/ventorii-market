import mongoose, { Schema, ObjectId } from 'mongoose';

export const collectionModel = mongoose.model(
  'collections',
  new Schema({
    collection_address: {
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
    mint_price: {
      type: Number,
      required: true,
    },
  }),
);
