const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.TOKEN;
const PREFIX = "$";

const rap = require("./commands/rap");
const value = require("./commands/value");
const buy = require("./commands/buy");
const search = require("./commands/search");
const help = require("./commands/help");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    try {

        if (command === "rap")
            return rap.execute(message, args);

        if (command === "value")
            return value.execute(message, args);

        if (command === "buy")
            return buy.execute(message, args);

        if (command === "search")
            return search.execute(message, args);

        if (command === "help")
            return help.execute(message);

    } catch (err) {

        console.error(err);

        message.reply("An error occurred while running that command.");

    }

});

client.login(TOKEN);
