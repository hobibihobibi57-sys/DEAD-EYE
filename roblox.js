const axios = require("axios");
const cache = require("./cache");

async function getThumbnail(assetId) {

    if (cache.thumbnails.has(assetId))
        return cache.thumbnails.get(assetId);

    try {

        const response = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png&isCircular=false`
        );

        const image =
            response.data.data[0]?.imageUrl || null;

        cache.thumbnails.set(assetId, image);

        return image;

    } catch {

        return null;

    }

}

async function getCheapest(assetId) {

    if (cache.cheapest.has(assetId))
        return cache.cheapest.get(assetId);

    try {

        const response = await axios.get(
            `https://apis.roblox.com/marketplace-sales/v1/item/{collectibleItemId}/resellers?limit=10`
        );

        const cheapest = response.data.data?.[0] || null;

        cache.cheapest.set(assetId, cheapest);

        return cheapest;

    } catch {

        return null;

    }

}

module.exports = {
    getThumbnail,
    getCheapest
};
