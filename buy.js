const { EmbedBuilder } = require("discord.js");
const { searchItems } = require("../utils/rolimons");
const { getCheapest } = require("../utils/roblox");

module.exports = {

    async execute(message, args) {

        if (!args.length)
            return message.reply("Usage: `$buy <item name>`");

        const query = args.join(" ");

        const results = await searchItems(query);

        if (results.length === 0)
            return message.reply("No items found.");

        if (results.length > 1) {

            const list = results
                .slice(0, 10)
                .map((item, i) => `${i + 1}. ${item.name}`)
                .join("\n");

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Matching Items")
                        .setDescription(list)
                ]
            });

        }

        const item = results[0];

        const reseller = await getCheapest(item.id);

        if (!reseller)
            return message.reply("No copies are currently for sale.");

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .addFields(
                {
                    name: "Cheapest Price",
                    value: reseller.price.toLocaleString(),
                    inline: true
                },
                {
                    name: "Seller",
                    value: reseller.seller.name,
                    inline: true
                }
            );

        message.reply({
            embeds: [embed]
        });

    }

};
