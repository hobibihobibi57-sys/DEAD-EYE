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

function parseItem(assetId, item) {

    return {
        assetId: Number(assetId),

        name: item[0],

        acronym: item[1],

        rap: item[2] || 0,

        value: item[3] || 0,

        defaultValue: item[4] || 0,

        demand: item[5],

        trend: item[6],

        projected: item[7] !== -1,

        hyped: item[8] !== -1,

        rare: item[9] !== -1
    };

}

async function searchItems(query) {

    const items = await updateItems();

    query = query.toLowerCase().trim();

    const startsWith = [];
    const contains = [];

    for (const assetId in items) {

        const parsed = parseItem(assetId, items[assetId]);

        const lower = parsed.name.toLowerCase();

        if (lower.startsWith(query)) {

            startsWith.push(parsed);

        } else if (lower.includes(query)) {

            contains.push(parsed);

        }

    }

    startsWith.sort((a, b) => a.name.localeCompare(b.name));
    contains.sort((a, b) => a.name.localeCompare(b.name));

    return [...startsWith, ...contains];

}

async function getItem(assetId) {

    const items = await updateItems();

    const item = items[assetId];

    if (!item)
        return null;

    return parseItem(assetId, item);

}

module.exports = {
    updateItems,
    searchItems,
    getItem
};
