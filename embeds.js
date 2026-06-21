const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { getThumbnail } = require("./roblox");

const COLORS = {
    NORMAL: 0x2ECC71,
    PROJECTED: 0xE74C3C,
    RARE: 0xF1C40F,
    DEFAULT: 0x5865F2
};

function getColor(item) {

    if (item.projected)
        return COLORS.PROJECTED;

    if (item.rare)
        return COLORS.RARE;

    return COLORS.NORMAL;

}

async function createItemEmbed(item, type, cheapest = null) {

    const thumbnail = await getThumbnail(item.assetId);

    const embed = new EmbedBuilder()
        .setColor(getColor(item))
        .setTitle(
            `${item.rare ? "⭐ " : ""}${item.name}`
        )
        .setFooter({
            text: `Asset ID: ${item.assetId}`
        })
        .setTimestamp();

    if (thumbnail)
        embed.setThumbnail(thumbnail);

    if (item.projected) {

        embed.setDescription(
            "🟥 **This item is currently projected.**"
        );

    }

    switch (type) {

        case "rap":

            embed.addFields({
                name: "📈 RAP",
                value: `${item.rap.toLocaleString()} Robux`,
                inline: true
            });

            break;

        case "value":

            embed.addFields({
                name: "💎 Value",
                value:
                    item.value > 0
                        ? `${item.value.toLocaleString()} Robux`
                        : "No Value",
                inline: true
            });

            break;

        case "buy":

            embed.addFields({
                name: "💰 Cheapest Copy",
                value: cheapest
                    ? `${cheapest.price.toLocaleString()} Robux`
                    : "Not currently for sale"
            });

            break;

        case "search":

            embed.addFields(
                {
                    name: "📈 RAP",
                    value: `${item.rap.toLocaleString()} Robux`,
                    inline: true
                },
                {
                    name: "💎 Value",
                    value:
                        item.value > 0
                            ? `${item.value.toLocaleString()} Robux`
                            : "No Value",
                    inline: true
                },
                {
                    name: "💰 Cheapest Copy",
                    value: cheapest
                        ? `${cheapest.price.toLocaleString()} Robux`
                        : "Not currently for sale"
                }
            );

            break;

    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("🛒 Roblox")
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://www.roblox.com/catalog/${item.assetId}`
            ),

        new ButtonBuilder()
            .setLabel("📊 Rolimons")
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://www.rolimons.com/item/${item.assetId}`
            )
    );

    return {
        embeds: [embed],
        components: [row]
    };

}

module.exports = {
    COLORS,
    createItemEmbed
};
