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
    await client.guilds.cache.get('875443271697068062')?.commands.create(thirdCommand);

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
        await getRank(interaction);

});


// recognizes any message except bots
client.on('messageCreate', async (msg) => {
    if (!msg.author.bot) {
        await addMessage(msg);
        //await ImagesTest(msg);
    }
})

async function ImagesTest(msg){
    // channel for welcome
    const welcomeChannel = client.channels.cache.get(process.env.CHANNELWELCOME);
    // load font
    await Canvas.registerFont('./src/font/muktamalar.ttf', {family: 'MuktaMalar'})

    // create image png of background with avatar image
    const canvasBackground = Canvas.createCanvas(1024, 500);
    const contextBackground = canvasBackground.getContext('2d');

    const background = await Canvas.loadImage('./src/img/background.png');
    contextBackground.drawImage(background, 0, 0, canvasBackground.width, canvasBackground.height);

    contextBackground.strokeStyle = '#0099ff';
    contextBackground.strokeRect(0, 0, canvasBackground.width, canvasBackground.height);

    contextBackground.font = '45px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Bienvenido`, 512, 370);

    contextBackground.font = '55px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`${msg.author.username}#${msg.author.discriminator}`, 512, 430);

    contextBackground.beginPath();
    contextBackground.arc(512, 200, 100, 0, Math.PI * 2, false);
    contextBackground.closePath();
    contextBackground.clip();

    const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({format: 'png'}));
    contextBackground.drawImage(avatar, 412, 100, 200, 200);

    // add hat top background
    const canvasHat = Canvas.createCanvas(1024, 500);
    const contextHat = canvasHat.getContext('2d');

    const typeBackground = await Canvas.loadImage(canvasBackground.toBuffer());
    contextHat.drawImage(typeBackground, 0, 0, canvasHat.width, canvasHat.height);

    const hat = await Canvas.loadImage('./src/img/gorra.png');
    contextHat.drawImage(hat, 424.58, 47.7);

    // create message with image
    const attachment = new MessageAttachment(canvasHat.toBuffer(), `profile-${msg.author.id}231.png`);

    // send image
    welcomeChannel.send({files: [attachment]});
}

// timer for day
let hr = cron.schedule('18 * * * *', async () => {
    try{ // get remembers
        const data = await QueryAllRemember();
        for (const detail of data) {
            await embedRemember(client, MessageEmbed, detail);
            await QueryDeleteRemember(detail.idRemember);
        }
        hr.start();
    }catch (e) {
        return console.log({errorDetail: e})
    }
});

// bot token
client.login(process.env.TOKENBOT);