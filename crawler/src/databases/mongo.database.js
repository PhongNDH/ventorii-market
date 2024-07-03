'use strict'

import config from '../configs/index.js';
import mongoose from 'mongoose';

import Record from '../models/record.model.js';
import { collectionModel } from '../models/collection.model.js';
import { nftModel } from '../models/nft.model.js';
import { userModel } from '../models/user.model.js';

class Databases {

    constructor() {
        // Make sure connect returns a promise and is awaited
        this.connectionPromise = this.connect();
    }

    connect(type = 'mongodb') {
        // Return the promise from mongoose.connect so it can be awaited
        return mongoose.connect(config.database.uri, {
            maxPoolSize: 100, // Maximum number of connection in the pool
        })
            .then(database => {
                console.log(`Database ${database.connection.name} connected!`);
            })
            .catch(error => {
                console.log('Error connecting to database', error);
                throw error; // Rethrow to make sure errors are not silently ignored
            });
    }

    static async getInstance() {
        if (!this.instance) {
            this.instance = new Databases();
            // Wait for the connection to be established before returning the instance
            await this.instance.connectionPromise;
        }
        return this.instance;
    }

    static async getLastRecord({ url }) {
        const lastRecord = await Record.findOne({ url: url }).sort({ timestamp: -1 }).lean();
        return lastRecord || {
            fromBlock: 77000,
            toBlock: 77000,
            blockNumbers: 0
        };
    }

    static async saveRecord(data) {
        return await Record.create(data);
    }

    static async eraseData() {
        await Record.deleteMany({});
        await collectionModel.deleteMany({});
        await nftModel.deleteMany({});
        await userModel.deleteMany({});
    }

    static async saveNFT(data) {
        const foundNFT = await nftModel.findOne({ token_id: data.token_id }).lean();
        if (foundNFT) return await nftModel.updateOne({ token_id: data.token_id }, { listing: true });
        return await nftModel.create(data);
    }

    static async changeNFTOwner({
        token_id,
        owner,
    }) {
        return await nftModel.updateOne({
            token_id: token_id,
        }, {
            owner: owner,
        });
    }

    static async changeNFTStatus({
        token_id,
        listing,
    }) {
        return await nftModel.updateOne({
            token_id: token_id,
        }, {
            listing: listing,
        });
    }

    static async changeNFTPrice({
        token_id,
        price,
    }) {
        return await nftModel.updateOne({
            token_id: token_id,
        }, {
            price: price,
        });
    }

    static async listingNFT({
        token_id,
        price,
    }) {
        return await nftModel.updateOne({
            token_id: token_id,
        }, {
            price: price,
            listing: true,
        });
    }

    static async saveCollection(data) {
        const foundCollection = await collectionModel.findOne({ collection_address: data.collection_address }).lean();
        if (foundCollection) return foundCollection;
        return await collectionModel.create(data);
    }

    static async getCollection({ collection_address }) {
        return await collectionModel.findOne({ collection_address: collection_address }).lean();
    }

    static async saveOwner(data) {
        const foundOwner = await userModel.findOne({ address: data.address });
        if (foundOwner) return foundOwner;
        return await userModel.create(data);
    }
}

export default Databases;