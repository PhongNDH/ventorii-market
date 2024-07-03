import axios from "axios";
import Databases from "../databases/mongo.database.js";
import Utils from "../utils/utils.js";

class Helpers {
  static async handleListedEvent({ event }) {
    const token_id = Utils.feltToInt({
      low: event.data[2],
      high: event.data[3],
    });
    const price = Utils.feltToInt({
      low: event.data[4],
      high: event.data[5],
    });
    console.log("Listed", token_id, price / 10 ** 18);
    await Databases.listingNFT({
      token_id,
      price: price / 10 ** 18,
    });
  }

  static async handleCancelEvent({ event }) {
    const token_id = Utils.feltToInt({
      low: event.data[0],
      high: event.data[1],
    });
    console.log("Cancel", token_id);
    await Databases.changeNFTStatus({
      token_id,
      listing: false,
    });
  }

  static async handleBoughtEvent({ event }) {
    const buyer = event.data[0];
    const token_id = Utils.feltToInt({
      low: event.data[2],
      high: event.data[3],
    });
    console.log("Bought", token_id);
    await Databases.changeNFTOwner({
      token_id,
      owner: buyer,
    });
    /* un list */
    await Databases.changeNFTStatus({
      token_id,
      listing: false,
    });
  }

  static async handleEditPriceEvent({ event }) {
    const token_id = Utils.feltToInt({
      low: event.data[0],
      high: event.data[1],
    });
    const price = Utils.feltToInt({
      low: event.data[2],
      high: event.data[3],
    });
    await Databases.changeNFTPrice({
      token_id,
      price: price / 10 ** 18,
    });
  }

  static async handleNFTMintedEvent({ event }) {
    const ownerAddress = event.data[1];
    const token_id = Utils.feltToInt({
      low: event.data[2],
      high: event.data[3],
    });

    console.log("Minted", token_id);

    await Databases.saveOwner({ address: ownerAddress });
    await Databases.getCollection({
      collection_address: process.env.NFT_CONTRACT,
    });
    const { data: nftMetadata } = await axios.get(
      `https://grow-api.memeland.com/token/metadata/${token_id}.json`
    );
    await Databases.saveNFT({
      token_id,
      name: nftMetadata.name,
      owner: ownerAddress,
      collection_address: process.env.NFT_CONTRACT,
      image: nftMetadata.image,
    });
  }
}

export default Helpers;
