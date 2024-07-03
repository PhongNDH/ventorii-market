import axios from 'axios';
import { EVENT_ACTION_HASH, CRAWLER } from '../constants/constants.js';
import {
    RpcProvider,
    Contract
} from "starknet";
class Utils {
    static async getBlockNumber() {
        const body = {
            jsonrpc: "2.0",
            method: "starknet_blockNumber",
            id: 0,
        };
        const { data } = await axios.post(CRAWLER.URL, body);
        return data?.result || 0;
    }

    static async getEvent({ contractAddress, fromBlock, toBlock }) {
        const body = {
            jsonrpc: "2.0",
            method: "starknet_getEvents",
            params: [
                {
                    from_block: {
                        block_number: fromBlock,
                    },
                    to_block: {
                        block_number: toBlock,
                    },
                    address: contractAddress,
                    chunk_size: 1000,
                    keys: [Object.values(EVENT_ACTION_HASH)],
                },
            ],
            id: 1,
        };
        const { data } = await axios.post(CRAWLER.URL, body);
        return data?.result?.events || [];
    }

    static async getEvents({ contractAddressArray, fromBlock }) {
        const toBlock = Math.min(fromBlock + CRAWLER.JUMP_STEP, await this.getBlockNumber());
        const events = [];
        console.log(`Getting events from ${fromBlock} to ${toBlock}`);
        for(const contractAddress of contractAddressArray) {
            const event = await this.getEvent({ contractAddress, fromBlock, toBlock });
            events.push(...event);
        }
        console.log(`Got ${events.length} events`);

        return { events, toBlock }
    }

    static feltToStr = (felt) => {
        let hex = felt.toString(16);
        if (hex.length % 2 !== 0) {
            hex = '0' + hex;
        }
        const text = Buffer.from(hex, 'hex').toString('utf8');
        return text;
    }

    static feltToInt = ({ low, high }) => {
        return Number((BigInt(high) << 64n) + BigInt(low));
    }

    static getCollectionInformation = async ({
        contractAddress
    }) => {
        const provider = new RpcProvider({
            nodeUrl: CRAWLER.URL,
        });
        const { abi: contractAbi } = await provider.getClassAt(contractAddress);
        if (!contractAbi) return null;
        const contractView = new Contract(contractAbi, contractAddress, provider);
        const name = await contractView.name();
        const symbol = await contractView.symbol();
        const mintPrice = await contractView.get_mint_price(1);

        return {
            collection_address: contractAddress,
            name: this.feltToStr(name),
            symbol: this.feltToStr(symbol),
            mint_price: Number(mintPrice) / 10 ** 18,
            image: 'https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000'
        };
    }
}

export default Utils;