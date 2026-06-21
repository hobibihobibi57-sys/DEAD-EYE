const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require("discord.js");

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load every command automatically
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if ("data" in command && "execute" in command) {

        client.commands.set(command.data.name, command);

        console.log(`Loaded command: ${command.data.name}`);

    }

}

client.once(Events.ClientReady, () => {

    console.log(`Logged in as ${client.user.tag}`);

});

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isAutocomplete()) {

        const command = client.commands.get(interaction.commandName);

        if (!command || !command.autocomplete)
            return;

        try {

            await command.autocomplete(interaction);

        } catch (err) {

            console.error(err);

        }

        return;

    }

    if (!interaction.isChatInputCommand())
        return;

    const command = client.commands.get(interaction.commandName);

    if (!command)
        return;

    try {

        await command.execute(interaction);

    } catch (err) {

        console.error(err);

        if (interaction.replied || interaction.deferred) {

            interaction.followUp({
                content: "There was an error while executing this command.",
                ephemeral: true
            });

        } else {

            interaction.reply({
                content: "There was an error while executing this command.",
                ephemeral: true
            });

        }

    }

});

client.login(TOKEN);
