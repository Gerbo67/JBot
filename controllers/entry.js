// require
const Canvas = require("canvas");

module.exports = (client, MessageEmbed, MessageAttachment) => {
    client.on('guildMemberAdd', async member => {
        try {
            // message private
            await sendMessagePrivate(MessageEmbed, member);

            // message public (canvas)
            await sendMessagePublic(member, MessageAttachment, client);
        } catch (e) {
            console.log({message: "No send message", detail: e});
        }
    });
}

async function sendMessagePrivate(MessageEmbed, member) {
    // message private
    const welcome = await new MessageEmbed()
        .setTitle(`Bienvenido ${member.user.username} a esta familia de MR BRO`)
        .setFooter('Estamos ansiosos de conocerte')
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
        .setTitle(`Puedes buscarme en estas redes.`)
        .setColor(0x35EAD4);
    const twitch = await new MessageEmbed()
        .setTitle(`Twitch`)
        .setThumbnail('https://blog.twitch.tv/assets/uploads/01-twitch-logo.jpg')
        .setDescription('https://www.twitch.tv/soymrbro')
        .setFooter('Aqui probamos los juegos y cosas nuevas, ven a platicar cuando puedas.')
        .setColor(0xBA9BFF);
    const youtube = await new MessageEmbed()
        .setTitle(`Youtube`)
        .setThumbnail('https://1000logos.net/wp-content/uploads/2017/05/Old-YouTube-logo.jpg')
        .setDescription('https://www.youtube.com/channel/UCdWKZFauW7-tn3DCwBIyweQ')
        .setFooter('Aqui puedes ver tutoriales de los juegos.')
        .setColor(0xED6476);
    const instagram = await new MessageEmbed()
        .setTitle(`Instagram`)
        .setThumbnail('https://www.exclusievesportcentra.nl/content/uploads/2019/03/new-instagram-logo-png-transparent.png')
        .setDescription('https://www.instagram.com/soymrbro/')
        .setFooter('Mi OnlyFans 😘')
        .setColor(0xFFE990);
    const twitter = await new MessageEmbed()
        .setTitle(`Twitter`)
        .setThumbnail('https://www.pngkey.com/png/full/2-27646_twitter-logo-png-transparent-background-logo-twitter-png.png')
        .setDescription('https://twitter.com/SoyMrBro')
        .setFooter('Mis noticias y reclamos 🤣')
        .setColor(0x95F2FF);
    // send the embed to the same channel as the message
    member.send({embeds: [welcome, games, spam, twitch, youtube, instagram, twitter]});
}

async function sendMessagePublic(member, MessageAttachment, client) {

    // channel for welcome
    const welcomeChannel = client.channels.cache.get('880882296478126140');

    // load font
    await Canvas.registerFont('./font/muktamalar.ttf', {family: 'MuktaMalar'})

    // create image png of background with avatar image
    const canvasBackground = Canvas.createCanvas(1024, 500);
    const contextBackground = canvasBackground.getContext('2d');

    const background = await Canvas.loadImage('./img/background.png');
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

    const typeBackground = await Canvas.loadImage(await canvasBackground.toBuffer());
    contextHat.drawImage(typeBackground, 0, 0, canvasHat.width, canvasHat.height);

    const hat = await Canvas.loadImage('./img/gorra.png');
    contextHat.drawImage(hat, 424.58, 47.7);

    // create message with image
    const attachment = new MessageAttachment(canvasHat.toBuffer(), `profile-${member.user.id}.png`);

    // send image
    welcomeChannel.send({files: [attachment]});
}