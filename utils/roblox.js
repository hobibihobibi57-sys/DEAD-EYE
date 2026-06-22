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

if (image)
    cache.thumbnails.set(assetId, image);

        return image;

    } catch (err) {

console.error(
    `[ROBLOX] Thumbnail lookup failed for ${assetId}:`,
    err.response?.data || err.message
);

        return null;

    }

}

async function getCollectibleItemId(assetId) {

    try {

        const response = await axios.get(
            `https://economy.roblox.com/v2/assets/${assetId}/details`
        );

        return response.data.CollectibleItemId ?? null;

    } catch (err) {

        console.error(
            `[ROBLOX] Collectible lookup failed for ${assetId}:`,
            err.response?.data || err.message
        );

        return null;

    }

}

async function getCheapest(assetId) {

    if (cache.cheapest.has(assetId))
        return cache.cheapest.get(assetId);

    try {

        // Get asset details first
        const details = await axios.get(
            `https://economy.roblox.com/v2/assets/${assetId}/details`
        );

        const collectibleId = details.data.CollectibleItemId;

        if (!collectibleId)
            return null;

        // Get reseller list
        const response = await axios.get(
            `https://apis.roblox.com/marketplace-sales/v1/item/${collectibleId}/resellers?limit=10`
        );

        const cheapest = response.data.data?.[0] ?? null;

        cache.cheapest.set(assetId, cheapest);

        return cheapest;

    } catch (err) {

        console.error(
            `[ROBLOX] Cheapest lookup failed for ${assetId}:`,
            err.response?.data || err.message
        );

        return null;

    }

}

module.exports = {
    getIcon,
    getCollectibleItemId,
    getCheapest
};
