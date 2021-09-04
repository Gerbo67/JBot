const moment = require('moment');
const {dateCondition} = require("../utils/date");
const {QueryAddRemember, QueryRememberById, QueryDeleteRemember} = require("../dao/rememberDAO");
const {getRandomArbitrary} = require("../utils/random");

async function addRemember(interaction) {
    const date = interaction.options.getString('fecha');
    const title = interaction.options.getString('titulo');
    const body = interaction.options.getString('cuerpo');

    //validate date string
    if (moment(date, 'DD/MM/YY', true).isValid()) {
        //validate date now
        if (dateCondition(date)) {
            let condition = true;
            let rememberId;

            while (condition) {
                console.log("Entro");
                rememberId = getRandomArbitrary(10000, 90000);
                console.log(rememberId);
                let result = await QueryRememberById(rememberId);
                console.log(result);
                if (result.length === 0)
                    condition = false;
            }

            let resultRemember = await QueryAddRemember(rememberId, date, title, body, `${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.id.toString());
            if (resultRemember > 0) {
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

    const result = await QueryDeleteRemember(parseInt(rememberId));

    if (result > 0) {
        await interaction.reply({content: 'Eliminado correctamente'});
    } else {
        await interaction.reply({content: 'No pude ser eliminado o no corresponde a un id existente'});
    }
}

async function embedRemember(client, MessageEmbed, detail) {

    // channel for remember
    const rememberChannel = client.channels.cache.get(process.env.CHANNELREMEMBER);

    const remember = await new MessageEmbed()
        .setTitle(detail.titleRemember)
        .setDescription(detail.bodyRemember)
        .setFooter(detail.tagUser, (await client.users.fetch(detail.idUser)).displayAvatarURL({format: "png"}))
        .setColor(0x1E90FF)
        .setThumbnail('https://cdn.discordapp.com/attachments/875443272254894083/880998521321439242/reloj.png')

    rememberChannel.send({embeds: [remember]});
}

module.exports = {addRemember, deleteRemember, embedRemember};