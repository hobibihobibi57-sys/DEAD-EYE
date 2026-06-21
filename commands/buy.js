const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { searchItems, getAutocomplete, getItem } = require("../utils/rolimons");
const { getCheapest } = require("../utils/roblox");
const { createItemEmbed } = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Shows the cheapest available copy of a Roblox limited.")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Choose a Roblox limited")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        try {
            const focused = interaction.options.getFocused();
            const results = await searchItems(focused);

            const choices = await getAutocomplete(focused);

            if (results.length > 1) {
                await interaction.respond(choices);

                const list = results
                    .slice(0, 10)
                    .map((item, i) => `${i + 1}. ${item.name}`)
                    .join("\n");

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Matching Items")
                            .setDescription(list)
                    ]
                });
            }

            if (results.length === 0) {
                return interaction.respond([]);
            }

        } catch (err) {
            console.error(err);
        }
    },

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const assetId = interaction.options.getString("item");
            const item = await getItem(assetId);

            if (!item) {
                return interaction.editReply({
                    content: "❌ Item not found."
                });
            }

            const cheapest = await getCheapest(assetId);

            if (!cheapest) {
                return interaction.editReply({
                    content: "No copies are currently for sale."
                });
            }

            const reply = await createItemEmbed(
                item,
                "buy",
                cheapest
            );

            return interaction.editReply(reply);

        } catch (err) {
            console.error(err);

            if (interaction.deferred) {
                return interaction.editReply({
                    content: "❌ Something went wrong."
                });
            } else {
                return interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });
            }
        }
    }
};
