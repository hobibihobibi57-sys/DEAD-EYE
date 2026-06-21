const {
    SlashCommandBuilder
} = require("discord.js");

const {
    getAutocomplete,
    getItem
} = require("../utils/rolimons");

const {
    createItemEmbed
} = require("../utils/embeds");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("value")
        .setDescription("Shows the Rolimons value of a Roblox limited.")
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

            const assetId = interaction.options.getString("item");

            const item = await getItem(assetId);

            if (!item) {

                return interaction.reply({
                    content: "❌ Item not found.",
                    ephemeral: true
                });

            }

            const reply = await createItemEmbed(
                item,
                "value"
            );

            await interaction.reply(reply);

        } catch (err) {

            console.error(err);

            if (!interaction.replied) {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });

            }

        }

    }

};
