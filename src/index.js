// imports
require('dotenv').config();
const cron = require('node-cron');
const {dateNow} = require('./utils/date');
const entry = require('./controllers/entryController');
const {firstCommand, secondCommand} = require("./utils/commands");
const {QueryAllRemember, QueryDeleteRemember} = require("./dao/rememberDAO");
const {addRemember, deleteRemember, embedRemember} = require('./controllers/rememberController');
const {Client, MessageEmbed, Intents, MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
const {QueryCardsDetails, QueryGamesDetails} = require("./dao/entryDAO");
const {addCount} = require("./dao/counterDAO");

// object Client initialization
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

// bot ready
client.on('ready', async () => {
    console.log(`Bot ${client.user.username}#${client.user.discriminator} escuchando.`);

    // send Welcome message
    await entry(client, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow);

    /* code initial for bot into server

    // register commands
    await client.guilds.cache.get('875443271697068062')?.commands.create(firstCommand);
    await client.guilds.cache.get('875443271697068062')?.commands.create(secondCommand);


    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitch.png', 'Twitch');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/youtube.png', 'Youtube');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/instagram.png', 'Instagram');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitter.png', 'Twitter');
     */
});

// actions command
client.on('interactionCreate', async interaction => {

    if (interaction.channelId == process.env.CHANNELREMEMBER) {
        if (interaction.commandName === 'recordatorio') {
            await addRemember(interaction);
        }

        if (interaction.commandName === 'eliminar-recordatorio') {
            await deleteRemember(interaction);
        }
    } else {
        interaction.reply({content: 'Este comando no es valido aqui', ephemeral: true})
    }
});


// recognizes any message except bots
client.on('messageCreate', async (msg) => {
    if (!msg.author.bot) {
        await addCount(parseInt(msg.author.id), msg.author.tag);
    }
})


// timer for day
let hr = cron.schedule('10 * * * *', async () => {
    // get remembers
    const data = await QueryAllRemember();
    for (const detail of data) {
        await embedRemember(client, MessageEmbed, detail);
        await QueryDeleteRemember(detail.idRemember);
    }
    hr.start();
});

// bot token
client.login(process.env.TOKENBOT);