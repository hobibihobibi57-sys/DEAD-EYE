const { EmbedBuilder } = require("discord.js");
const { searchItems } = require("../utils/rolimons");
const {
    sendSearchResults,
    getItemThumbnail
} = require("../utils/searchResults");

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

        if (results.length > 1) {
            return sendSearchResults(message, results);
        }

        const item = results[0];

        const thumbnail = await getItemThumbnail(item.id);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription("Recent Average Price")
            .addFields({
                name: "RAP",
                value: item.rap > 0
                    ? `${item.rap.toLocaleString()} Robux`
                    : "Unknown",
                inline: true
            })
            .setFooter({
                text: `Asset ID: ${item.id}`
            })
            .setTimestamp();

        if (thumbnail)
            embed.setThumbnail(thumbnail);

        return message.reply({
            embeds: [embed]
        });

    }

};
