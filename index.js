// requires
require('dotenv').config();
const cron = require("node-cron");
const {dateNow} = require("./utils/date");
const entry = require('./controllers/entry');
const {QueryAll, QueryDeleteRemember} = require("./utils/queryData");
const {addRemember, deleteRemember, embedRemember} = require("./controllers/remember");
const {Client, MessageEmbed, Intents, MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
const {firstCommand} = require("./utils/commands");

// object Client initialization
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

// bot ready
client.on('ready', async () => {
    console.log(`Bot ${client.user.username}#${client.user.discriminator} escuchando.`)
    await entry(client, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow);

    // register commands
    /*
    await client.guilds.cache.get('875443271697068062')?.commands.create(firstCommand);
    await client.guilds.cache.get('875443271697068062')?.commands.create(secondCommand);
    await client.guilds.cache.get('875443271697068062')?.emojis.create('./img/twitch.png', 'Twitch');
    await client.guilds.cache.get('875443271697068062')?.emojis.create('./img/youtube.png', 'Youtube');
    await client.guilds.cache.get('875443271697068062')?.emojis.create('./img/instagram.png', 'Instagram');
    await client.guilds.cache.get('875443271697068062')?.emojis.create('./img/twitter.png', 'Twitter');
     */
});


client.on('interactionCreate', async interaction => {
    if (interaction.commandName === 'recordatorio') {
        await addRemember(interaction);
    }

    if (interaction.commandName === 'eliminar-recordatorio') {
        await deleteRemember(interaction);
    }
});


// timer for day
cron.schedule('1 */2 * * *', async () => {
    let jsonData = {...await QueryAll()};
    console.log(jsonData);
    for (const detail of jsonData.rememberDetails) {
        if (detail.date === dateNow()) {
            console.log("Entro");
            await embedRemember(client, MessageEmbed, detail);
            await QueryDeleteRemember(detail.id);
        }
    }
});


client.login(process.env.TOKENBOT);