const moment = require('moment');
const {dateCondition} = require("../utils/date");
const {QueryAddRemember} = require("../utils/queryData");

async function addRemember(interaction) {
    const date = interaction.options.getString('fecha');
    const title = interaction.options.getString('titulo');
    const body = interaction.options.getString('cuerpo');
    const footer = interaction.options.getString('pie');

    //validate date string
    if (moment(date, 'DD/MM/YY', true).isValid()) {
        //validate date now
        if (dateCondition(date)) {
            let rememberId = await QueryAddRemember(date, title, body, footer);
            if (rememberId !== -1) {
                await interaction.reply({content: `Recordatorio guardado correctamente con fecha: ${date} y por titulo: ${title}, ID:${rememberId}`});
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

module.exports = {addRemember};