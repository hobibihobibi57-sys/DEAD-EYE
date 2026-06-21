const axios = require("axios");

let cache = null;
let lastUpdate = 0;

async function updateItems() {

    const now = Date.now();

    if (cache && (now - lastUpdate < 300000))
        return cache;

    const response = await axios.get(
        "https://api.rolimons.com/items/v1/itemdetails"
    );

    cache = response.data.items;
    lastUpdate = now;

    return cache;

}

async function searchItems(query) {

    const items = await updateItems();

    query = query.toLowerCase();

    const startsWith = [];
    const contains = [];

    for (const id in items) {

        const item = items[id];

        const name = item[0];

        const lower = name.toLowerCase();

        const object = {
            id,
            name,
            rap: item[2],
            value: item[3]
        };

        if (lower.startsWith(query)) {
            startsWith.push(object);
        } else if (lower.includes(query)) {
            contains.push(object);
        }

    }

    return [...startsWith, ...contains];

}

async function getItem(query) {

    const results = await searchItems(query);

    if (results.length === 0)
        return null;

    return results[0];

}

module.exports = {
    updateItems,
    searchItems,
    getItem
};
