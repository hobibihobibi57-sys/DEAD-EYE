const axios = require("axios");
const cache = require("./cache");

async function getThumbnail(assetId) {

    if (cache.thumbnails.has(assetId))
        return cache.thumbnails.get(assetId);

    try {

        const response = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png&isCircular=false`
        );

        const image = response.data.data[0]?.imageUrl || null;

        cache.thumbnails.set(assetId, image);

        return image;

    } catch (err) {

        console.error(err);

        return null;

    }

}

async function getCollectibleItemId(assetId) {

    try {

        const response = await axios.get(
            `https://economy.roblox.com/v2/assets/${assetId}/details`
        );

        return response.data.CollectibleItemId || null;

    } catch (err) {

        console.error(err);

        return null;

    }

}

async function getCheapest(assetId) {

    if (cache.cheapest.has(assetId))
        return cache.cheapest.get(assetId);

    const collectibleItemId = await getCollectibleItemId(assetId);

    if (!collectibleItemId)
        return null;

    try {

        const response = await axios.get(
            `https://apis.roblox.com/marketplace-sales/v1/item/${collectibleItemId}/resellers?limit=10`
        );

        const cheapest = response.data.resellers?.[0] || null;

        cache.cheapest.set(assetId, cheapest);

        return cheapest;

    } catch (err) {

        console.error(err);

        return null;

    }

}

module.exports = {
    getThumbnail,
    getCollectibleItemId,
    getCheapest
};
