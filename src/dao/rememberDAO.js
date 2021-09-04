// imports
const mssql = require('../database/database');

async function QueryAddRemember(idRemember, date, title, body, userTag, userId) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`INSERT INTO Remembers
                    VALUES (${idRemember}, '${date}', '${title}', '${body}', '${userTag}', '${userId}')`);
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function QueryRememberById(idRemember) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`SELECT *
                    FROM Remembers
                    WHERE idRemember = ${idRemember}`);
        return result.recordset;
    } catch (err) {
        return err;
    }
}

async function QueryDeleteRemember(idRemember) {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`DELETE
                    FROM Remembers
                    WHERE idRemember = ${idRemember}`);
        return result.rowsAffected[0];
    } catch (err) {
        return err;
    }
}

async function QueryAllRemember() {
    await mssql.pool;
    try {
        const request = mssql.connection.request();
        const result = await request
            .query(`SELECT *
                    FROM Remembers`);
        return result.recordset;
    } catch (err) {
        return err;
    }
}

module.exports = {QueryAddRemember, QueryRememberById, QueryDeleteRemember, QueryAllRemember};