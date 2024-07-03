import mongoose, { Schema, ObjectId } from 'mongoose';

export const userModel = mongoose.model(
  'users',
  new Schema({
    address: {
      type: String,
      required: true,
    },
  }),
);
