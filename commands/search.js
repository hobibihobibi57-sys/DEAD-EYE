const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    searchItems,
    getAutocomplete
} = require("../utils/rolimons");

const {
    getThumbnail
} = require("../utils/roblox");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Search Roblox limited items")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Item name")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    // AUTOCOMPLETE (NO RAP / VALUE ANYMORE)
    async autocomplete(interaction) {
        const focused = interaction.options.getFocused();

        const choices = await getAutocomplete(focused);

        await interaction.respond(
            choices.slice(0, 25)
        );
    },

    async execute(interaction) {
        const query = interaction.options.getString("query");

        const results = await searchItems(query);

        if (!results.length) {
            return interaction.reply({
                content: "No items found.",
                ephemeral: true
            });
        }

        // If multiple results → show list (like search bar)
        if (results.length > 1) {

            const list = await Promise.all(
                results.slice(0, 10).map(async (item, i) => {
                    return `${i + 1}. **${item.name}**`;
                })
            );

            const embed = new EmbedBuilder()
                .setTitle("Matching Items")
                .setDescription(list.join("\n"))
                .setColor(0x5865F2)
                .setFooter({
                    text: `${results.length} results found`
                });

            return interaction.reply({ embeds: [embed] });
        }

        // Single item result
        const item = results[0];
        const thumbnail = await getThumbnail(item.assetId);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setColor(0x2ECC71)
            .setThumbnail(thumbnail)
            .addFields(
                {
                    name: "📊 RAP",
                    value: item.rap ? item.rap.toLocaleString() : "N/A",
                    inline: true
                },
                {
                    name: "💎 Value",
                    value: item.value ? item.value.toLocaleString() : "N/A",
                    inline: true
                },
                {
                    name: "⭐ Status",
                    value:
                        item.rare
                            ? "Rare"
                            : item.projected
                            ? "Projected"
                            : "Normal",
                    inline: true
                }
            );

        return interaction.reply({ embeds: [embed] });
    }
};
