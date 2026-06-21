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

function getScore(item, query) {

    const name = item.name.toLowerCase();
    const acronym = (item.acronym || "").toLowerCase();
    const q = query.toLowerCase().trim();

    // Exact name
    if (name === q)
        return 1000;

    // Exact acronym
    if (acronym === q)
        return 950;

    // Starts with
    if (name.startsWith(q))
        return 900;

    // Word starts with
    const words = name.split(" ");

    if (words.some(word => word.startsWith(q)))
        return 800;

    // Acronym starts with
    if (acronym.startsWith(q))
        return 700;

    // Contains
    if (name.includes(q))
        return 600;

    return 0;

}

async function searchItems(query) {

    const items = await updateItems();

    query = query.trim();

    if (!query.length)
        return [];

    const results = [];

    for (const assetId in items) {

        const parsed = parseItem(assetId, items[assetId]);

        const score = getScore(parsed, query);

        if (score > 0) {

            results.push({
                ...parsed,
                score
            });

        }

    }

    results.sort((a, b) => {

        // Better match first
        if (b.score !== a.score)
            return b.score - a.score;

        // Higher value first
        if (b.value !== a.value)
            return b.value - a.value;

        // Higher RAP first
        if (b.rap !== a.rap)
            return b.rap - a.rap;

        // Alphabetical
        return a.name.localeCompare(b.name);

    });

    return results.slice(0, 25);

}

async function getAutocomplete(query) {

    const results = await searchItems(query);

    return results.map(item => ({
        name: item.name.length > 100
            ? item.name.substring(0, 97) + "..."
            : item.name,
        value: item.assetId.toString()
    }));

}

async function getItem(assetId) {

    const items = await updateItems();

    if (!items[assetId])
        return null;

    return parseItem(assetId, items[assetId]);

}

module.exports = {
    updateItems,
    searchItems,
    getAutocomplete,
    getItem
};
