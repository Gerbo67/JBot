// require
const fs = require("fs");
const {getRandomArbitrary} = require("../utils/random");

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

async function QueryAddRemember(date, title, description, footer) {
    try {
        let jsonData = {...await QueryAll()};
        let rememberId;
        let i = false;

        while (i === false) {
            rememberId = getRandomArbitrary(10000, 90000);
            const isLargeNumber = (element) => element === rememberId;
            if (jsonData.rememberId.findIndex(isLargeNumber) === -1) {
                i = true;
                jsonData.rememberId.push(rememberId);

                if (footer !== null) {
                    jsonData.rememberDetails.push({date: date, title: title, description: description, footer: footer});
                } else {
                    jsonData.rememberDetails.push({date: date, title: title, description: description});
                }
            }
        }
        fs.writeFileSync("./database/data.json", JSON.stringify(jsonData));
        return rememberId;
    } catch (e) {
        return -1;
    }
}

module.exports = {QueryAll, QueryById, QueryAddUserId, QueryAddRemember};