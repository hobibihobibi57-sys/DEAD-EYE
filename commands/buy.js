const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { searchItems } = require("../utils/rolimons");
const { getCheapest, getThumbnail } = require("../utils/roblox");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Get the cheapest price of a Roblox limited item")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item name")
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString("item");

        const results = await searchItems(query);

        if (!results.length) {
            return interaction.reply({
                content: "No items found.",
                ephemeral: true
            });
        }

        const item = results[0];

        const priceData = await getCheapest(item.assetId);
        const thumbnail = await getThumbnail(item.assetId);

        if (!priceData || !priceData.ok) {
            return interaction.reply({
                content: "This item is currently off sale or has no resellers.",
                ephemeral: true
            });
        }

        const color = 0x2ECC71; // green

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setColor(color)
            .setThumbnail(thumbnail)
            .addFields(
                {
                    name: "💰 Cheapest Price",
                    value: `${priceData.price.toLocaleString()} R$`,
                    inline: true
                },
                {
                    name: "📦 Source",
                    value: priceData.source === "fast" ? "Instant data" : "Marketplace API",
                    inline: true
                },
                {
                    name: "📊 RAP",
                    value: item.rap ? item.rap.toLocaleString() : "N/A",
                    inline: true
                },
                {
                    name: "💎 Value",
                    value: item.value ? item.value.toLocaleString() : "N/A",
                    inline: true
                }
            );

        return interaction.reply({ embeds: [embed] });
    }
};
