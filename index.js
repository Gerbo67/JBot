// requires
require('dotenv').config();
const {Client, MessageEmbed, Intents, MessageAttachment} = require('discord.js');
const entry = require('./controllers/entry');
const fs = require("fs");

// object Client initialization
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

// bot ready
client.on('ready', () => {
    console.log(`Bot ${client.user.username}#${client.user.discriminator} escuchando.`)
    entry(client, MessageEmbed, MessageAttachment);
});
/*
client.on('ready', async () =>{
    client.user.setPresence({activities: [{name: 'Gerbo67', type:'WATCHING'}]});
    console.log(`${client.user.tag} is online`)

    const data = {
        name: 'ping',
        description: 'Replies with pong!',
        options: [{
            name: 'input',
            description: 'Enter a string',
            type: 'STRING',
        }],
    }

    const command = await client.guilds.cache.get('875443271697068062')?.commands.create(data);
})

client.on('interactionCreate', async interaction =>{
    if (interaction.commandName === 'ping') {
        const text = interaction.options.getString('input')
        await interaction.reply({ content: 'Pong!' + text, ephemeral: true});
    }
});
 */
client.on('messageCreate', async msg => {
    if (!msg.author.bot) {
        //console.log(await QueryById("1218100471"));
    }
});


client.login(process.env.TOKENBOT);