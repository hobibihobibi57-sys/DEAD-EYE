const { EmbedBuilder } = require("discord.js");
const { searchItems } = require("../utils/rolimons");
const { sendSearchResults } = require("../utils/searchResults");

module.exports = {

    async execute(message, args) {

        if (!args.length) {
            return message.reply("Usage: `$rap <item name>`");
        }

        const query = args.join(" ");

        const results = await searchItems(query);

        if (results.length === 0) {
            return message.reply("No items found.");
        }

        // Multiple matches
        if (results.length > 1) {
            return sendSearchResults(message, results);
        }

        // One match
        const item = results[0];

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .addFields({
                name: "Recent Average Price (RAP)",
                value: item.rap > 0
                    ? item.rap.toLocaleString()
                    : "Unknown",
                inline: true
            });

        message.reply({
            embeds: [embed]
        });

    }

};
