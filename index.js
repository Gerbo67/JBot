// requires
require('dotenv').config();
const {Client, MessageEmbed, Intents, MessageAttachment} = require('discord.js');
const cron = require("node-cron");
const entry = require('./controllers/entry');
const {firstCommand, secondCommand} = require("./utils/commands");
const {addRemember, deleteRemember} = require("./controllers/remember");
const {dateNow} = require("./utils/date");
const {QueryAll} = require("./utils/queryData");

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
    await client.guilds.cache.get('875443271697068062')?.commands.create(secondCommand);


    //let jsonData = {...await QueryAll()};
    //dateNow()
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
/*
cron.schedule('0 0 1-31 * *', () => {
    console.log("Hola");
});
 */


/*
client.on('messageCreate', async msg => {
    if (!msg.author.bot) {
        //console.log(await QueryById("1218100471"));
    }
});
*/


client.login(process.env.TOKENBOT);