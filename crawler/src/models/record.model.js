import mongoose from "mongoose";

const COLLECTION_NAME = 'records';

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    fromBlock: {
        type: Number,
        required: true,
    },
    toBlock: {
        type: Number,
        required: true,
    },
    blockNumbers: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model(COLLECTION_NAME, schema);
export default model;