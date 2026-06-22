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
    "https://api.rolimons.com/items/v2/itemdetails"
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

function normalize(text) {

    return (text || "")
        .toLowerCase()
        .replace(/['".,()\-]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}

function getScore(item, query) {

    const q = normalize(query);

    const name = normalize(item.name);
    const acronym = normalize(item.acronym);

    if (!q.length)
        return 0;

    // Asset ID
    if (item.assetId.toString() === q)
        return 1100;

    // Exact name
    if (name === q)
        return 1000;

    // Exact acronym
    if (acronym === q)
        return 980;

    // Starts with full name
    if (name.startsWith(q))
        return 950;

    // Starts with acronym
    if (acronym.startsWith(q))
        return 900;

    // Every search word exists somewhere
    const terms = q.split(" ");

    if (terms.every(term => name.includes(term)))
        return 850;

    // Starts with any word
    const words = name.split(" ");

    if (words.some(word => word.startsWith(q)))
        return 800;

    // Contains
    if (name.includes(q))
        return 700;

    // Ignore spaces
    if (
        name.replace(/\s/g, "")
            .includes(q.replace(/\s/g, ""))
    )
        return 650;

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

        if (b.score !== a.score)
            return b.score - a.score;

        const worthA = Math.max(a.value, a.rap);
const worthB = Math.max(b.value, b.rap);

if (worthB !== worthA)
    return worthB - worthA;

        return a.name.localeCompare(b.name);

    });

    return results.slice(0, 25);

}

async function getAutocomplete(query) {

    const results = await searchItems(query);

    return results.map(item => {

        const rap =
            item.rap > 0
                ? `${Math.round(item.rap / 1000)}k`
                : "?";

        const value =
            item.value > 0
                ? `${Math.round(item.value / 1000)}k`
                : "N/A";

        let label = item.name;

        if (label.length > 100)
            label = label.substring(0, 97) + "...";

        return {
            name: label,
            value: item.assetId.toString()
        };

    });

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
    getAutocomplete,
    getItem
};
