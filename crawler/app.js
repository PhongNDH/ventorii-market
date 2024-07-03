import Databases from "./src/databases/mongo.database.js";
import { EVENT_ACTION_HASH, CRAWLER } from "./src/constants/constants.js";
import Helpers from "./src/helpers/helpers.js";
import Utils from "./src/utils/utils.js";

let error = false;

async function handleEvent({ event }) {
    try {
        switch (event.keys[0]) {
            case EVENT_ACTION_HASH.MARKET_LISTED:
                await Helpers.handleListedEvent({ event });
                break;
            case EVENT_ACTION_HASH.MARKET_BOUGHT:
                await Helpers.handleBoughtEvent({ event });
                break;
            case EVENT_ACTION_HASH.MARKET_CANCEL:
                await Helpers.handleCancelEvent({ event });
                break;
            case EVENT_ACTION_HASH.MARKET_EDIT_PRICE:
                await Helpers.handleEditPriceEvent({ event });
                break;
            case EVENT_ACTION_HASH.NFT_MINTED:
                await Helpers.handleNFTMintedEvent({ event });
                break;
            default:
                break;
        }
    } catch (err) {
        error = true;
        console.log(err);   
    }
}

async function main() {
    await Databases.getInstance();
    await Databases.eraseData();

    const collection = await Utils.getCollectionInformation({
        contractAddress: process.env.NFT_CONTRACT
    });
    await Databases.saveCollection(collection);
    while (1) {
        const lastRecord = await Databases.getLastRecord({ url: CRAWLER.URL });
        const { events, toBlock } = await Utils.getEvents({
            // List by Higher Priority
            contractAddressArray: [process.env.NFT_CONTRACT, process.env.MARKET_CONTRACT],
            fromBlock: lastRecord.toBlock + 1
        });

        for (const event of events) await handleEvent({ event });

        // Save record
        // 1. If there are events
        // 2. If the crawler has jumped from the the past
        // Don't save record
        // If the crawler has crawled on top
        if(error) continue;
        if (events.length || toBlock == lastRecord.toBlock + 1 + CRAWLER.JUMP_STEP) {
            await Databases.saveRecord({
                url: CRAWLER.URL,
                fromBlock: lastRecord.toBlock + 1,
                toBlock,
                blockNumbers: events.length
            });
        }
    }
    process.exit(0);
}

main();