const cache = {
    rolimons: {
        data: null,
        lastUpdated: 0
    },

    thumbnails: new Map(),

    cheapest: new Map()
};

module.exports = cache;
