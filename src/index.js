// imports
require('dotenv').config();
const cron = require('node-cron');
const entry = require('./controllers/entryController');
const {QueryAllRemember, QueryDeleteRemember} = require("./dao/rememberDAO");
const {addRemember, deleteRemember, embedRemember} = require('./controllers/rememberController');
const {Client, MessageEmbed, Intents, MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
const {addMessage, getRank} = require("./controllers/counterController");
const {thirdCommand} = require("./utils/commands");
const Canvas = require("canvas");

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
    await client.guilds.cache.get('734787764679082174')?.commands.create(thirdCommand);

    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitch.png', 'Twitch');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/youtube.png', 'Youtube');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/instagram.png', 'Instagram');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitter.png', 'Twitter');
     */

});

// actions command
client.on('interactionCreate', async interaction => {

    if (interaction.commandName === 'recordatorio')
        if (interaction.channelId == process.env.CHANNELREMEMBER)
            await addRemember(interaction);
        else
            interaction.reply({content: 'Este comando no es valido aqui', ephemeral: true})


    if (interaction.commandName === 'eliminar-recordatorio')
        if (interaction.channelId == process.env.CHANNELREMEMBER)
            await deleteRemember(interaction);
        else
            interaction.reply({content: 'Este comando no es valido aqui', ephemeral: true})


    if (interaction.commandName === 'rank')
        await getRank(interaction, client);

});


// recognizes any message except bots
client.on('messageCreate', async (msg) => {
    if (!msg.author.bot) {
        await addMessage(msg);
    }
})

// timer for day
let hr = cron.schedule('18 * * * *', async () => {
    try { // get remembers
        const data = await QueryAllRemember();
        for (const detail of data) {
            await embedRemember(client, MessageEmbed, detail);
            await QueryDeleteRemember(detail.idRemember);
        }
        hr.start();
    } catch (e) {
        return console.log({errorDetail: e})
    }
});

// bot token
client.login(process.env.TOKENBOT);