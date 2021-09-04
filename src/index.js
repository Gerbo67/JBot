// imports
require('dotenv').config();
const cron = require('node-cron');
const {dateNow} = require('./utils/date');
const entry = require('./controllers/entryController');
const {addRemember, deleteRemember, embedRemember} = require('./controllers/rememberController');
const {Client, MessageEmbed, Intents, MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
const {firstCommand, secondCommand} = require("./utils/commands");
const {QueryAllRemember, QueryDeleteRemember} = require("./dao/rememberDAO");

// object Client initialization
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

// bot ready
client.on('ready', async () => {
    console.log(`Bot ${client.user.username}#${client.user.discriminator} escuchando.`);

    await entry(client, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow);

    // register commands
    //await client.guilds.cache.get('875443271697068062')?.commands.create(firstCommand);
    //await client.guilds.cache.get('875443271697068062')?.commands.create(secondCommand);

    /*
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitch.png', 'Twitch');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/youtube.png', 'Youtube');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/instagram.png', 'Instagram');
    await client.guilds.cache.get('734787764679082174')?.emojis.create('./img/twitter.png', 'Twitter');
     */

});


client.on('interactionCreate', async interaction => {
    if (true) {
        if (interaction.commandName === 'recordatorio') {
            await addRemember(interaction);
        }

        if (interaction.commandName === 'eliminar-recordatorio') {
            await deleteRemember(interaction);
        }
    } else {
        interaction.reply({content: "Comandos en mantenimiento"});
    }
});


// timer for day
let hr = cron.schedule('*/10 * * * * *', async () => {
    const data = await QueryAllRemember();
    console.log(data);
    console.log(dateNow());
    for (const detail of data) {
        if (detail.dateRemember === dateNow()) {
            await embedRemember(client, MessageEmbed, detail);
            await QueryDeleteRemember(detail.id);
        }
    }
    hr.start();
});



client.login(process.env.TOKENBOT);