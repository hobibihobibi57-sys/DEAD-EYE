const axios = require("axios");
const cache = require("./cache");

const THUMBNAIL_URL =
    "https://thumbnails.roblox.com/v1/assets";

async function getIcon(assetId) {

    if (cache.thumbnails.has(assetId))
        return cache.thumbnails.get(assetId);

    try {

        const response = await axios.get(
            `${THUMBNAIL_URL}?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
        );

        const image =
            response.data.data?.[0]?.imageUrl ?? null;

        cache.thumbnails.set(assetId, image);

        return image;

    } catch (err) {

        console.error("Thumbnail Error:", err.message);

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

        console.error("Collectible Error:", err.message);

        return null;

    }

}

async function getCheapest(assetId) {

    if (cache.cheapest.has(assetId))
        return cache.cheapest.get(assetId);

    try {

        const response = await axios.get(
            `https://economy.roblox.com/v1/assets/${assetId}/resellers?limit=10`
        );

        const cheapest = response.data.data?.find(
            reseller =>
                reseller &&
                typeof reseller.price === "number"
        ) || null;

        cache.cheapest.set(assetId, cheapest);

        return cheapest;

    } catch (err) {

        console.error("Reseller Error:", err.message);

        return null;

    }

}

module.exports = {
    getIcon,
    getCollectibleItemId,
    getCheapest
};
