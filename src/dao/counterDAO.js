// imports
const mssql = require('../database/database');

async function addCount(idUser, tagUser){
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .input('IdUser', mssql.sql.TYPES.VarChar, idUser)
            .input('TagUser', mssql.sql.TYPES.VarChar(100), tagUser)
            .execute('SetCount')
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = {addCount};