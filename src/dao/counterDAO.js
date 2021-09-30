// imports
const mssql = require('../database/database');

async function addCount(idUser, tagUser) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .input('IdUser', mssql.sql.TYPES.Char(20), idUser)
            .input('TagUser', mssql.sql.TYPES.Char(40), tagUser)
            .execute('SetCount')
        return result.recordset;
    } catch (err) {
        return err;
    }
}

async function addLevel(idUser, level) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`UPDATE Members
                    SET level = ${level}
                    WHERE idUser = '${idUser}'`);
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function addCountMonth(idUser) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .input('IdUser', mssql.sql.TYPES.Char(20), idUser)
            .execute('SetCountPosition');
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function addRank(idUser, rank) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`UPDATE Members
                    SET idRank = ${rank}
                    WHERE idUser = '${idUser}'`)
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function setFlag(idUser, number) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .input('IdUser', mssql.sql.TYPES.Char(20), idUser)
            .input('number', mssql.sql.TYPES.TinyInt, number)
            .execute('SetFlagRank')
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function getFlag(idUser) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`SELECT rankChange
                    FROM Flags
                    WHERE idUser = '${idUser}'`)
        return result.recordset[0];
    } catch (err) {
        return err;
    }
}

async function getData() {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`SELECT ROW_NUMBER()                       over (ORDER BY MP.countMessage DESC) as numberPosition, m.idUser,
                           m.tagUser,
                           FORMAT(m.dateEntry, 'dd/MM/yy') as dateEntry,
                           m.messagesTotal,
                           MP.countMessage,
                           m.level,
                           RM.idRank,
                           RM.nombre
                    FROM Members m
                             INNER JOIN RankMembers RM on m.idRank = RM.idRank
                             INNER JOIN MessagePosition MP on m.idUser = MP.idUser
                    WHERE MP.month = MONTH (GETDATE())
                      AND MP.year = YEAR (GETDATE())`)
        return result.recordset;
    } catch (err) {
        return err;
    }
}


module.exports = {addCount, addLevel, addCountMonth, addRank, getData, setFlag, getFlag};