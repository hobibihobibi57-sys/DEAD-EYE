const axios = require("axios");
const cache = require("./cache");

const CACHE_TIME = 5 * 60 * 1000;

async function updateItems() {

    if (
        cache.rolimons.data &&
        Date.now() - cache.rolimons.lastUpdated < CACHE_TIME
    ) {
        return cache.rolimons.data;
    }

    const response = await axios.get(
        "https://api.rolimons.com/items/v1/itemdetails"
    );

    cache.rolimons.data = response.data.items;
    cache.rolimons.lastUpdated = Date.now();

    return cache.rolimons.data;

}

async function searchItems(query) {

    const items = await updateItems();

    query = query.toLowerCase();

    const startsWith = [];
    const contains = [];

    for (const assetId in items) {

        const item = items[assetId];

        const name = item[0];
        const lower = name.toLowerCase();

        const object = {
            assetId,
            name,
            rap: item[2] || 0,
            value: item[3] || 0,
            projected: item[7] === 1,
            rare: item[8] === 1
        };

        if (lower.startsWith(query)) {
            startsWith.push(object);
        } else if (lower.includes(query)) {
            contains.push(object);
        }

    }

    return [...startsWith, ...contains];

}

async function getItem(assetId) {

    const items = await updateItems();

    const item = items[assetId];

    if (!item)
        return null;

    return {
        assetId,
        name: item[0],
        rap: item[2] || 0,
        value: item[3] || 0,
        projected: item[7] === 1,
        rare: item[8] === 1
    };

}

module.exports = {
    updateItems,
    searchItems,
    getItem
};
