const {addCount, addLevel, addCountMonth, addRank, getData, setFlag, getFlag} = require('../dao/counterDAO');
const {getLevel, getInt, getLimits} = require('../utils/levels');
const roles = require('../utils/roles');
const Canvas = require("canvas");
const {MessageAttachment} = require("discord.js");

async function addMessage(msg) {
    try {
        // get idUser
        const idUser = msg.author.id;

        // add number to message into DB
        const resMsg = await addCount(idUser, msg.author.tag);

        // add number to message into DB position for month
        await addCountMonth(idUser);

        if (resMsg.length > 0) {
            const messagesTotal = resMsg[0].messagesTotal;
            const levelDB = resMsg[0].level;

            // get level
            const level = getLevel(messagesTotal);

            if (level == 0) {
                await setFlag(idUser, 1);
            }

            // condition between levels
            if (levelDB != level) {
                await addLevel(idUser, level);
                await setFlag(idUser, 1);
                msg.reply('```⭐Asombroso nivel => ' + level + '⭐```');
            }

            const flagRank = await getFlag(idUser);

            if (flagRank.rankChange == 1) {
                // calc proccess rank
                const rank = level / 10;

                // add rank
                if (rank != 0) {
                    if (getInt(rank)) {
                        if (rank <= 10) {
                            await addRank(idUser, rank);
                            await setRol(rank, msg);
                            if (rank != 1) {
                                await removeRol(rank - 1, msg)
                            }
                            await setFlag(idUser, 0);
                            msg.reply('```🎉🎆🎈Tecleas mucho he?, subes al rango => ' + rank + ' 🎈🎆🎉```');
                        }
                    }
                }
            }
        }
    } catch (e) {
        return console.log({errorDetail: e})
    }
}

async function setRol(rank, msg) {
    try {
        const rol = msg.guild.roles.cache.get(roles[rank]);
        const member = msg.guild.members.cache.get(msg.author.id);
        await member.roles.add(rol);
    } catch (e) {
        return console.log({errorDetail: e})
    }
}

async function removeRol(rank, msg) {
    try {
        const rol = msg.guild.roles.cache.get(roles[rank]);
        const member = msg.guild.members.cache.get(msg.author.id);
        await member.roles.remove(rol);
    } catch (e) {
        return console.log({errorDetail: e})
    }
}

async function getRank(interaction, client) {
    try {
        const user = interaction.options.getUser('usuario');
        if (user != null)
            await getMessageData(user.id, interaction, client);
        else
            await getMessageData(interaction.user.id, interaction, client);
    } catch (e) {
        console.log({errorDetail: e})
        interaction.reply({content: "Intentalo de nuevo o consulta a Gerbo67", ephemeral: true});
    }
}

async function getMessageData(user, interaction, client) {
    try {
        const lstData = await getData();
        if (lstData.length > 0) {
            for (const item of lstData) {
                if (item.idUser.trim() == user) {
                    const image = await ImageRank(formatData(item), client);
                    await interaction.reply({files: [image]});
                }
            }
        } else {
            await interaction.reply('No hay datos disponibles');
        }
    } catch (e) {
        return console.log({errorDetail: e})
    }
}

function formatData(item) {

    const calcLevelInfo = getLimits(item.messagesTotal);

    const messagesRealLimit = ((item.messagesTotal - calcLevelInfo[1]) * 100) / ((item.level + 1) * 20);

    return {
        dateEntry: item.dateEntry,
        idUser: item.idUser.trim(),
        tagUser: item.tagUser.trim(),
        positionGeneral: item.numberPositionGeneral,
        messageGeneral: item.messagesTotal,
        positionMonth: item.numberPositionMonth,
        messageMonth: item.countMessage,
        numberLevel: item.level,
        numberRank: item.idRank,
        nameRank: item.nameRank.trim(),
        minLevel: (item.level * 20),
        maxLevel: ((item.level + 1) * 20),
        perLevel: messagesRealLimit
    }
}

async function ImageRank(dataUser, client) {
    // load font
    await Canvas.registerFont('./src/font/muktamalar.ttf', {family: 'MuktaMalar'})

    // create image png of background with avatar image
    const canvasBackground = Canvas.createCanvas(1024, 500);
    const contextBackground = canvasBackground.getContext('2d');

    const background = await Canvas.loadImage('./src/img/background-rank.png');
    contextBackground.drawImage(background, 0, 0, canvasBackground.width, canvasBackground.height);

    contextBackground.strokeStyle = '#0099ff';
    contextBackground.strokeRect(0, 0, canvasBackground.width, canvasBackground.height);

    //Fecha de entrada
    contextBackground.font = '16px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Fecha de entrada: ${dataUser.dateEntry}`, 512, 17.5);

    //Ranking General
    contextBackground.font = '18px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Ranking General`, 145, 100);

    contextBackground.font = 'extrabold 46px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`#${dataUser.positionGeneral}`, 145, 145);

    contextBackground.font = '18px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Mensajes enviados: ${dataUser.messageGeneral}`, 145, 235);

    //Ranking mensual
    contextBackground.font = '18px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Ranking Mensual`, 879, 100);

    contextBackground.font = 'extrabold 46px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`#${dataUser.positionMonth}`, 879, 145);

    contextBackground.font = '18px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Mensajes enviados: ${dataUser.messageMonth}`, 879, 235);


    //Rank
    contextBackground.font = 'bold 25px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`Rango ${dataUser.numberRank}`, 512, 318);

    contextBackground.font = 'bold 20px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`${dataUser.nameRank}`, 512, 370);

    //Limits level
    contextBackground.font = '22px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`✉️ ${dataUser.minLevel}`, 140, 460);

    contextBackground.font = '22px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`${dataUser.maxLevel} ✉️ `, 884, 460);


    //User data
    contextBackground.font = 'bold 30px MuktaMalar';
    contextBackground.textAlign = 'center';
    contextBackground.fillStyle = '#ffffff';
    contextBackground.fillText(`${dataUser.tagUser}`, 512, 235.5);

    //Percentage view
    let i;
    for (i = 0; i < 60; i++) {
        contextBackground.beginPath()
        contextBackground.lineWidth = 14
        contextBackground.strokeStyle = '#2196F3'
        contextBackground.fillStyle = '#2196F3'
        contextBackground.arc(298.5 + (i * 4.32), 453.5, 8, 0, Math.PI * 2, true)
        contextBackground.stroke()
        contextBackground.fill()
    }

    //Details for image
    const canvasDetails = Canvas.createCanvas(1024, 500);
    const contextDetails = canvasDetails.getContext('2d');

    const typeBackground = await Canvas.loadImage(canvasBackground.toBuffer());
    contextDetails.drawImage(typeBackground, 0, 0, canvasDetails.width, canvasDetails.height);

    //Percentage text
    contextDetails.font = 'bold 20px MuktaMalar';
    contextDetails.textAlign = 'center';
    contextDetails.fillStyle = '#ffffff';
    contextDetails.fillText(`Nivel: ${dataUser.numberLevel}`, 512, 460.5);


    //User Image
    contextDetails.beginPath();
    contextDetails.arc(512, 110, 60, 0, Math.PI * 2, false);
    contextDetails.closePath();
    contextDetails.clip();

    let member = await client.users.fetch(dataUser.idUser);
    const avatar = await Canvas.loadImage(member.displayAvatarURL({format: 'png'}));
    contextDetails.drawImage(avatar, 450, 50, 120, 120);


    // Add hat top background
    const canvasHat = Canvas.createCanvas(1024, 500);
    const contextHat = canvasHat.getContext('2d');

    const typeBackgroundDetail = await Canvas.loadImage(canvasDetails.toBuffer());
    contextHat.drawImage(typeBackgroundDetail, 0, 0, canvasHat.width, canvasHat.height);

    const hat = await Canvas.loadImage('./src/img/gorra.png');
    contextHat.drawImage(hat, 466, 10, 180, 140);

    // create message with image
    const attachment = new MessageAttachment(canvasHat.toBuffer(), `rango_${dataUser.tagUser}.png`);

    return attachment;
}

module.exports = {addMessage, getRank};