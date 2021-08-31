const moment = require('moment');
const {dateCondition} = require("../utils/date");
const {QueryAddRemember, QueryDeleteRemember, QueryAll} = require("../utils/queryData");

async function addRemember(interaction) {
    const date = interaction.options.getString('fecha');
    const title = interaction.options.getString('titulo');
    const body = interaction.options.getString('cuerpo');

    //validate date string
    if (moment(date, 'DD/MM/YY', true).isValid()) {
        //validate date now
        if (true) {
            let rememberId = await QueryAddRemember(date, title, body, `${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.id.toString());
            if (rememberId !== -1) {
                await interaction.reply({content: `Recordatorio guardado correctamente con fecha: ${date} y por titulo: ${title}, ID: ${rememberId}`});
            } else {
                await interaction.reply({content: 'No se ha guardado, favor de contactar con el administrador'});
            }
        } else {
            await interaction.reply({content: 'No puede ser una fecha menor o actual'});
        }
    } else {
        await interaction.reply({content: 'Fecha invalida'});
    }

}

async function deleteRemember(interaction) {
    const rememberId = interaction.options.getString('id');

    if (await QueryDeleteRemember(parseInt(rememberId))) {
        await interaction.reply({content: 'Eliminado correctamente'});
    } else {
        await interaction.reply({content: 'No pude ser eliminado o no corresponde a un id existente'});
    }
}

async function embedRemember(client, MessageEmbed, detail) {
    // query channelId
    let jsonData = {...await QueryAll()};

    // channel for remember
    const rememberChannel = client.channels.cache.get(jsonData.channelIdRemember);

    const remember = await new MessageEmbed()
        .setTitle(detail.title)
        .setDescription(detail.description)
        .setFooter(detail.user, (await client.users.fetch(detail.avatar)).displayAvatarURL({format: "png"}))
        .setColor(0x1E90FF)
        .setThumbnail('https://cdn.discordapp.com/attachments/875443272254894083/880998521321439242/reloj.png')

    rememberChannel.send({embeds: [remember]});
}

module.exports = {addRemember, deleteRemember, embedRemember};