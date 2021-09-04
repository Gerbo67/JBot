// imports
const mssql = require('../database/database');

async function QueryMember(idUser) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`SELECT *
                    FROM Members
                    WHERE idUser = ${idUser}`);
        return result.recordset;
    } catch (err) {
        return err;
    }
}

async function QueryAddMember(idUser) {
    console.log(idUser);
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`INSERT INTO Members VALUES (${idUser}, GETDATE())`);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = {QueryMember, QueryAddMember};