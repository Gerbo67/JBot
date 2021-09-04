// require
const Canvas = require('canvas');
const {QueryMember, QueryAddMember} = require("../dao/entryDAO");

module.exports = (client, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow) => {

    client.on('guildMemberAdd', async member => {
        const memberslst = await QueryMember(parseInt(member.user.id));
        if (memberslst.length === 0) {
            // message private
            await sendMessagePrivate(MessageEmbed, MessageButton, MessageActionRow, member);

            // message public (canvas)
            await sendMessagePublic(member, MessageAttachment, client);

            // add new user
            await QueryAddMember(parseInt(member.user.id));
        }
    });
}

async function sendMessagePrivate(MessageEmbed, MessageButton, MessageActionRow, member) {
    // message private
    const welcome = await new MessageEmbed()
        .setTitle(`Bienvenido ${member.user.username} a esta familia de MR BRO`)
        .setFooter('Estamos ansiosos de conocerte')
        .setDescription('En este servidor es dedicado a los juegos **Play to Earn**, porfavor de leer las reglas para no tener incovenientes, solo queda decirte que disfurtes tu estadia')
        .setColor(0xB7FFB1)
        .setThumbnail('https://cdn.discordapp.com/icons/734787764679082174/17de276cc643ff817bbeabdb5696d36e.png')
    const games = await new MessageEmbed()
        .setTitle(`Estos son los juegos que jugamos actualmente:`)
        .addField('🌷', '```Plant vs Undead```', true)
        .addField('👾', '```Axis Infinity```', true)
        .addField('🃏', '```Splinterlands```', true)
        .setFooter('Puedes recomendar algun otro juego 🤗')
        .setColor(0x1E90FF);

    const spam = await new MessageEmbed()
        .setTitle(`Mis Redes sociales`)
        .setColor(0x4A1B63);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Twitch')
                .setStyle('LINK')
                .setURL('https://www.twitch.tv/soymrbro')
                .setEmoji('883230334483845150'),
            new MessageButton()
                .setLabel('Youtube')
                .setStyle('LINK')
                .setURL('https://www.youtube.com/channel/UCdWKZFauW7-tn3DCwBIyweQ')
                .setEmoji('883230336476119040'),
            new MessageButton()
                .setLabel('Instagram')
                .setStyle('LINK')
                .setURL('https://www.instagram.com/soymrbro/')
                .setEmoji('883230340741738546'),
            new MessageButton()
                .setLabel('Twitter')
                .setStyle('LINK')
                .setURL('https://twitter.com/SoyMrBro')
                .setEmoji('883230343153451008')
        );

    // send the embed to the same channel as the message
    member.send({embeds: [welcome, games, spam], components: [row]});
}

async function sendMessagePublic(member, MessageAttachment, client) {

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
    contextBackground.fillText(`${member.user.username}#${member.user.discriminator}`, 512, 430);

    contextBackground.beginPath();
    contextBackground.arc(512, 200, 100, 0, Math.PI * 2, false);
    contextBackground.closePath();
    contextBackground.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
    contextBackground.drawImage(avatar, 412, 100, 200, 200);

    // add hat top background
    const canvasHat = Canvas.createCanvas(1024, 500);
    const contextHat = canvasHat.getContext('2d');

    const typeBackground = await Canvas.loadImage(canvasBackground.toBuffer());
    contextHat.drawImage(typeBackground, 0, 0, canvasHat.width, canvasHat.height);

    const hat = await Canvas.loadImage('./src/img/gorra.png');
    contextHat.drawImage(hat, 424.58, 47.7);

    // create message with image
    const attachment = new MessageAttachment(canvasHat.toBuffer(), `profile-${member.user.id}.png`);

    // send image
    welcomeChannel.send({files: [attachment]});
}
