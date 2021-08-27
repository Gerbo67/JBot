// require
const fs = require("fs");

async function QueryAll() {
    let data = fs.readFileSync('./database/data.json', "utf8");
    let jsonString = [data]
    let jsonObj = JSON.parse(jsonString);
    return jsonObj;
}

async function QueryById(userId) {
    let jsonData = {...await QueryAll()};
    const isLargeNumber = (element) => element === userId;
    return jsonData.usersInto.findIndex(isLargeNumber);
}

async function QueryAddUserId(userId) {
    let jsonData = {...await QueryAll()};
    jsonData.usersInto.push(userId);
    fs.writeFileSync("./database/data.json", JSON.stringify(jsonData));
}

module.exports = {QueryAll, QueryById,QueryAddUserId};