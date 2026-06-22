    const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { COLORS } = require("../utils/embeds");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all available commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(COLORS.DEFAULT)
            .setTitle("📚 DEADEYE COMMANDS")
            .setDescription("Here are all the available commands:")
            .addFields(
                {
                    name: "/rap",
                    value: "Shows the Recent Average Price (RAP) of a Roblox limited."
                },
                {
                    name: "/value",
                    value: "Shows the Rolimons value of a Roblox limited."
                },
                {
                    name: "/buy",
                    value: "Shows the cheapest available copy currently for sale."
                },
                {
                    name: "/search",
                    value: "Shows RAP, Value, and Cheapest Copy for a Roblox limited."
                },
                {
                    name: "/help",
                    value: "Displays this help menu."
                }
            )
            .setFooter({
                text: "DEADEYE"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};
