const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

async function getThumbnail(assetId) {

    try {

        const response = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
        );

        if (
            response.data &&
            response.data.data &&
            response.data.data.length > 0
        ) {
            return response.data.data[0].imageUrl;
        }

    } catch (err) {
        console.error(err);
    }

    return null;

}

async function sendSearchResults(message, results) {

    const embeds = [];

    for (const item of results.slice(0, 10)) {

        const image = await getThumbnail(item.id);

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .addFields(
                {
                    name: "RAP",
                    value: item.rap > 0
                        ? item.rap.toLocaleString()
                        : "Unknown",
                    inline: true
                },
                {
                    name: "Value",
                    value: item.value > 0
                        ? item.value.toLocaleString()
                        : "No Value",
                    inline: true
                }
            )
            .setFooter({
                text: `Asset ID: ${item.id}`
            });

        if (image)
            embed.setThumbnail(image);

        embeds.push(embed);

    }

    return message.reply({
        content: `Found **${results.length}** matching item(s). Showing the first **${Math.min(results.length, 10)}**.`,
        embeds
    });

}

module.exports = {
    sendSearchResults
};
