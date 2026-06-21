const axios = require("axios");

// Simple in-memory caches (fast + safe for Railway)
const detailsCache = new Map();
const resellerCache = new Map();
const collectibleCache = new Map();

/**
 * Fetch Roblox asset details (cached)
 */
async function getAssetDetails(assetId) {
    if (detailsCache.has(assetId)) {
        return detailsCache.get(assetId);
    }

    try {
        const { data } = await axios.get(
            `https://economy.roblox.com/v2/assets/${assetId}/details`
        );

        detailsCache.set(assetId, data);
        return data;

    } catch (err) {
        console.error(`[Roblox] Asset details error for ${assetId}`, err.message);
        return null;
    }
}

/**
 * Extract CollectibleItemId safely
 */
function getCollectibleItemId(details) {
    if (!details) return null;

    return details.CollectibleItemId || null;
}

/**
 * Get thumbnail (optional but useful for embeds)
 */
async function getThumbnail(assetId) {
    try {
        const { data } = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png&isCircular=false`
        );

        return data?.data?.[0]?.imageUrl || null;

    } catch (err) {
        console.error(`[Roblox] Thumbnail error for ${assetId}`, err.message);
        return null;
    }
}

/**
 * Get cheapest price (FAST PATH)
 * Uses CollectiblesItemDetails if available
 */
async function getFastCheapest(details) {
    const info = details?.CollectiblesItemDetails;

    if (!info) return null;

    if (typeof info.CollectibleLowestResalePrice === "number") {
        return {
            price: info.CollectibleLowestResalePrice,
            productId: info.CollectibleLowestAvailableResaleProductId || null,
            itemInstanceId: info.CollectibleLowestAvailableResaleItemInstanceId || null,
            source: "collectible"
        };
    }

    return null;
}

/**
 * Marketplace fallback (slower but reliable)
 */
async function getMarketplaceResellers(collectibleItemId) {
    if (!collectibleItemId) return null;

    if (resellerCache.has(collectibleItemId)) {
        return resellerCache.get(collectibleItemId);
    }

    try {
        const { data } = await axios.get(
            `https://apis.roblox.com/marketplace-sales/v1/item/${collectibleItemId}/resellers?limit=10`
        );

        const resellers = data?.data || [];

        resellerCache.set(collectibleItemId, resellers);

        return resellers;

    } catch (err) {
        console.error(`[Roblox] Reseller error for ${collectibleItemId}`, err.message);
        return null;
    }
}

/**
 * MAIN FUNCTION: Get cheapest listing info
 */
async function getCheapest(assetId) {
    const details = await getAssetDetails(assetId);

    if (!details) {
        return {
            ok: false,
            reason: "No details found"
        };
    }

    const collectibleItemId = getCollectibleItemId(details);

    // FAST PATH (no extra API call)
    const fast = await getFastCheapest(details);
    if (fast) {
        return {
            ok: true,
            assetId,
            name: details.Name,
            price: fast.price,
            source: "fast",
            collectibleItemId
        };
    }

    // FALLBACK PATH (Marketplace API)
    const resellers = await getMarketplaceResellers(collectibleItemId);

    if (!resellers || resellers.length === 0) {
        return {
            ok: false,
            reason: "Off sale or no resellers",
            assetId,
            collectibleItemId
        };
    }

    const cheapest = resellers[0];

    return {
        ok: true,
        assetId,
        name: details.Name,
        price: cheapest.price,
        seller: cheapest.seller,
        collectibleItemId,
        source: "marketplace"
    };
}

module.exports = {
    getAssetDetails,
    getCollectibleItemId,
    getThumbnail,
    getMarketplaceResellers,
    getCheapest
};
