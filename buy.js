const {
    SlashCommandBuilder
} = require("discord.js");

const {
    getAutocomplete,
    getItem
} = require("../utils/rolimons");

const {
    getCheapest
} = require("../utils/roblox");

const {
    createItemEmbed
} = require("../utils/embeds");

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

            const choices = await getAutocomplete(focused);

            await interaction.respond(choices);

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

            const reply = await createItemEmbed(
                item,
                "buy",
                cheapest
            );

            await interaction.editReply(reply);

        } catch (err) {

            console.error(err);

            if (interaction.deferred) {

                await interaction.editReply({
                    content: "❌ Something went wrong."
                });

            } else {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });

            }

        }

    }

};
