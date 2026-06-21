const { EmbedBuilder } = require("discord.js");
const { searchItems } = require("../utils/rolimons");

module.exports = {

    async execute(message, args) {

        if (!args.length) {
            return message.reply("Usage: `$value <item name>`");
        }

        const query = args.join(" ");

        const results = await searchItems(query);

        if (results.length === 0) {
            return message.reply("No items found.");
        }

        if (results.length > 1) {

            const list = results
                .slice(0, 10)
                .map((item, index) => `${index + 1}. ${item.name}`)
                .join("\n");

            const embed = new EmbedBuilder()
                .setTitle("Matching Items")
                .setDescription(list)
                .setFooter({
                    text: `${results.length} results found`
                });

            return message.reply({
                embeds: [embed]
            });

        }

        const item = results[0];

        const value = item.value > 0
            ? item.value.toLocaleString()
            : "No Value";

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .addFields({
                name: "Value",
                value,
                inline: true
            });

        message.reply({
            embeds: [embed]
        });

    }

};
