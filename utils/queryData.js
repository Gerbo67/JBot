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
    fs.writeFileSync("./database/data.json", JSON.stringify(jsonData),{encoding:'utf-8'});
}

async function QueryAddRemember(date, title, description, footer) {
    try {
        let jsonData = {...await QueryAll()};
        let rememberId;
        let i = false;

        while (i === false) {
            rememberId = getRandomArbitrary(10000, 90000);
            const isLargeNumber = (element) => element === rememberId;

            let index = jsonData.rememberDetails.findIndex(remember => {
                return remember.id === rememberId;
            });

            console.log(index);
            if (index === -1) {
                i = true;
                if (footer !== null) {
                    jsonData.rememberDetails.push({
                        id: rememberId,
                        date: date,
                        title: title,
                        description: description,
                        footer: footer
                    });
                } else {
                    jsonData.rememberDetails.push({date: date, title: title, description: description});
                }
            }
        }
        fs.writeFileSync("./database/data.json", JSON.stringify(jsonData),{encoding:'utf-8'});
        return rememberId;
    } catch (e) {
        return -1;
    }
}

async function QueryDeleteRemember(id) {
    try {
        let jsonData = {...await QueryAll()};

        let index = jsonData.rememberDetails.findIndex(remember => {
            return remember.id === id;
        });

        jsonData.rememberDetails.splice(index, 1);

        fs.writeFileSync("./database/data.json", JSON.stringify(jsonData),{encoding:'utf-8'});

        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {QueryAll, QueryById, QueryAddUserId, QueryAddRemember, QueryDeleteRemember};