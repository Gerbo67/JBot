module.exports = (client, MessageEmbed) => {
    client.on('guildMemberAdd', async member => {
        const welcome = await new MessageEmbed()
            .setTitle(`Bienvenido ${member.username} a esta familia de MR BRO`)
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
        // Send the embed to the same channel as the message
        member.send({embeds: [welcome, games, spam, twitch, youtube, instagram, twitter]});
    });
}