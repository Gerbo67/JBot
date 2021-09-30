const moment = require('moment');
const {dateCondition} = require("../utils/date");
const {QueryAddRemember, QueryRememberById, QueryDeleteRemember} = require("../dao/rememberDAO");
const {getRandomArbitrary} = require("../utils/random");

/*  add remember with command
 *  Conditions:
 *  date - DD/MM/YY - date greater than today
 *  title - length < 99
 *  body - length < 199
 */
async function addRemember(interaction) {
    try {
        // get values
        const date = interaction.options.getString('fecha');
        const title = interaction.options.getString('titulo');
        const body = interaction.options.getString('cuerpo');

        //validate date string
        if (moment(date, 'DD/MM/YY', true).isValid()) {
            //validate date now
            if (dateCondition(date)) {
                if (title.length < 100) {
                    if (body.length < 200) {
                        let condition = true;
                        let rememberId;

                        // generate id
                        while (condition) {
                            rememberId = getRandomArbitrary(10000, 90000);
                            let result = await QueryRememberById(rememberId);
                            if (result.length === 0)
                                condition = false;
                        }

                        // database insert
                        let resultRemember = await QueryAddRemember(rememberId, date, title, body, `${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.id);
                        if (resultRemember > 0) {
                            await interaction.reply({content: `Recordatorio guardado correctamente con fecha: ${date} y por titulo: ${title}, ID: ${rememberId}`});
                        } else {
                            await interaction.reply({
                                content: 'No se ha guardado, favor de contactar con el administrador',
                                ephemeral: true
                            });
                        }
                    } else {
                        await interaction.reply({
                            content: 'El cuerpo no puede tener mas de 199 caracteres',
                            ephemeral: true
                        });
                    }
                } else {
                    await interaction.reply({
                        content: 'El titulo no puede tener mas de 99 caracteres',
                        ephemeral: true
                    });
                }
            } else {
                await interaction.reply({content: 'No puede ser una fecha menor o actual', ephemeral: true});
            }
        } else {
            await interaction.reply({content: 'Fecha invalida', ephemeral: true});
        }
    } catch (e) {
        console.log({errorDetail: e});
        //interaction.reply({content: "Intentalo de nuevo o consulta a Gerbo67", ephemeral: true});
    }
}

/*  delete remember with command
 *  Conditions:
 *  id - correct id
 */
async function deleteRemember(interaction) {
    try {
        const rememberId = interaction.options.getString('id');

        const result = await QueryDeleteRemember(parseInt(rememberId));

        if (result > 0) {
            await interaction.reply({content: 'Eliminado correctamente'});
        } else {
            await interaction.reply({
                content: 'No pude ser eliminado o no corresponde a un id existente',
                ephemeral: true
            });
        }
    } catch (e) {
        console.log({errorDetail: e});
        interaction.reply({content: "Intentalo de nuevo o consulta a Gerbo67", ephemeral: true});
    }
}

//  send remember with embed into channel dedicated
async function embedRemember(client, MessageEmbed, detail) {
    // channel for remember
    const rememberChannel = client.channels.cache.get(process.env.CHANNELREMEMBER);
    try {
        const remember = await new MessageEmbed()
            .setTitle(detail.titleRemember)
            .setDescription(detail.bodyRemember)
            .setFooter(detail.tagUser, (await client.users.fetch(detail.idUser)).displayAvatarURL({format: "png"}))
            .setColor(0x1E90FF)
            .setThumbnail('https://cdn.discordapp.com/attachments/875443272254894083/880998521321439242/reloj.png');

        rememberChannel.send({embeds: [remember]});
    } catch (e) {
        console.log({errorDetail: e});
        rememberChannel.send({content: "No pudo ser enviado el recordatorio, contactar a Gerbo67"});
    }
}

module.exports = {addRemember, deleteRemember, embedRemember};