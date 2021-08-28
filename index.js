// requires
require('dotenv').config();
const {Client, MessageEmbed, Intents, MessageAttachment} = require('discord.js');
const entry = require('./controllers/entry');
const {firstCommand} = require("./utils/commands");
const {addRemember} = require("./controllers/remember");
const {dateNow, dateCondition} = require("./utils/date");

// object Client initialization
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

// bot ready
client.on('ready', async () => {
    console.log(`Bot ${client.user.username}#${client.user.discriminator} escuchando.`)
    entry(client, MessageEmbed, MessageAttachment);

    // register commands
    await client.guilds.cache.get('875443271697068062')?.commands.create(firstCommand);
});


client.on('interactionCreate', async interaction => {
    if (interaction.commandName === 'recordatorio') {
        await addRemember(interaction);
    }
});


client.on('messageCreate', async msg => {
    if (!msg.author.bot) {
        //console.log(await QueryById("1218100471"));
    }
});


client.login(process.env.TOKENBOT);