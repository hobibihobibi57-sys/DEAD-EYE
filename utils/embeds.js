const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { getIcon } = require("./roblox");

const COLORS = {
    NORMAL: 0x2ECC71,     // Green
    PROJECTED: 0xE74C3C,  // Red
    RARE: 0xF1C40F,       // Gold
    DEFAULT: 0x5865F2     // Discord Blurple
};

function getColor(item) {

    if (item.projected)
        return COLORS.PROJECTED;

    if (item.rare)
        return COLORS.RARE;

    return COLORS.NORMAL;

}

function formatDemand(demand) {

    switch (demand) {

        case 0:
            return "Terrible";

        case 1:
            return "Low";

        case 2:
            return "Normal";

        case 3:
            return "High";

        case 4:
            return "Amazing";

        default:
            return "Not Assigned";

    }

}

function formatTrend(trend) {

    switch (trend) {

        case 0:
            return "Lowering";

        case 1:
            return "Unstable";

        case 2:
            return "Stable";

        case 3:
            return "Raising";

        case 4:
            return "Fluctuating";

        default:
            return "Not Assigned";

    }

}

async function createItemEmbed(item, mode, cheapest = null) {

    const icon = await getIcon(item.assetId);

    const embed = new EmbedBuilder()
        .setColor(getColor(item))
        .setTitle(`${item.rare ? "⭐ " : ""}${item.name}`)
        .setFooter({
            text: `Asset ID: ${item.assetId}`
        })
        .setTimestamp();

    if (icon)
        embed.setImage(icon);

    let description = "";

    if (item.projected)
        description += "🟥 **Projected Item**\n";

    if (item.rare)
        description += "⭐ **Rare Item**\n";

    if (description.length === 0)
        description = "🟢 **Limited Item**";

    embed.setDescription(description);

    switch (mode) {

        case "rap":

            embed.addFields(
                {
                    name: "📈 Recent Average Price",
                    value: item.rap > 0
                        ? `**${item.rap.toLocaleString()} Robux**`
                        : "Unknown",
                    inline: false
                }
            );

            break;

        case "value":

            embed.addFields(
                {
                    name: "💎 Rolimons Value",
                    value: item.value > 0
                        ? `**${item.value.toLocaleString()} Robux**`
                        : "No Value",
                    inline: false
                }
            );

            break;

        case "buy":

    embed.addFields(
        {
            name: "💰 Cheapest Copy",
            value: cheapest
                ? `**${cheapest.price.toLocaleString()} Robux**`
                : "Not currently for sale",
            inline: false
        }
    );

    if (cheapest?.seller?.name) {

        embed.addFields({
            name: "👤 Seller",
            value: cheapest.seller.name,
            inline: true
        });

    }

    if (cheapest?.serialNumber !== null && cheapest?.serialNumber !== undefined) {

        embed.addFields({
            name: "#️⃣ Serial",
            value: `#${cheapest.serialNumber}`,
            inline: true
        });

    }

    break;

case "search":

    embed.addFields(

        {
            name: "📈 RAP",
            value: item.rap > 0
                ? `**${item.rap.toLocaleString()} Robux**`
                : "Unknown",
            inline: true
        },

        {
            name: "💎 Value",
            value: item.value > 0
                ? `**${item.value.toLocaleString()} Robux**`
                : "No Value",
            inline: true
        },

        {
            name: "\u200B",
            value: "\u200B",
            inline: true
        },

        {
            name: "📊 Demand",
            value: formatDemand(item.demand),
            inline: true
        },

        {
            name: "📉 Trend",
            value: formatTrend(item.trend),
            inline: true
        },

        {
            name: "\u200B",
            value: "\u200B",
            inline: true
        },

        {
            name: "💰 Cheapest Copy",
            value: cheapest
                ? `**${cheapest.price.toLocaleString()} Robux**`
                : "Not currently for sale",
            inline: false
        }

    );

    if (cheapest?.seller?.name) {

        embed.addFields({
            name: "👤 Seller",
            value: cheapest.seller.name,
            inline: true
        });

    }

    if (cheapest?.serialNumber !== null &&
        cheapest?.serialNumber !== undefined) {

        embed.addFields({
            name: "#️⃣ Serial",
            value: `#${cheapest.serialNumber}`,
            inline: true
        });

    }

    break;

    }

    const buttons = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
                .setLabel("Roblox")
                .setEmoji("🛒")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://www.roblox.com/catalog/${item.assetId}`
                ),

            new ButtonBuilder()
                .setLabel("Rolimons")
                .setEmoji("📊")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://www.rolimons.com/item/${item.assetId}`
                )

        );

    return {

        embeds: [embed],

        components: [buttons]

    };

}

module.exports = {

    COLORS,

    createItemEmbed

};
