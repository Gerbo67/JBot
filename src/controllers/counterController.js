const {addCount, addLevel, addCountMonth, addRank, getData, setFlag, getFlag} = require('../dao/counterDAO');
const {getLevel, getInt} = require('../utils/levels');
const roles = require('../utils/roles');

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

async function getRank(interaction) {
    try {
        const user = interaction.options.getUser('usuario');
        let msg;
        if (user != null)
            msg = await getMessageData(user.id);
        else
            msg = await getMessageData(interaction.user.id);

        interaction.reply(msg);
    } catch (e) {
        console.log({errorDetail: e})
        interaction.reply({content: "Intentalo de nuevo o consulta a Gerbo67", ephemeral: true});
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

async function getMessageData(user) {
    try {
        const lstData = await getData();
        if (lstData.length > 0) {
            for (const item of lstData) {
                if (item.idUser.trim() == user) {
                    return `Posicion: ${item.numberPosition} Usuario: ${item.tagUser.trim()}, entro el: ${item.dateEntry}, Lleva total: ${item.messagesTotal}, En el mes: ${item.countMessage} con nivel: ${item.level} y rango ${item.idRank}:${item.nombre.trim()}`;
                }
            }
            return `No se encuentra usuario mencionado`;
        } else {
            return 'No hay datos disponibles';
        }
    } catch (e) {
        return console.log({errorDetail: e})
    }
}

module.exports = {addMessage, getRank};