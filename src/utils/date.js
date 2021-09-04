// obj of Date
const dateSystem = new Date();

// gets the formatted date DD/MM/YY
function dateNow() {
    let day = dateSystem.getDate().toString();
    let month = (dateSystem.getMonth() + 1).toString();
    let year = dateSystem.getFullYear().toString();
    if (day.length === 1) {
        day = `0${day}`;
    }

    if (month.length === 1) {
        month = `0${month}`;
    }

    if (year.length === 4) {
        let yearSegment = year.split('')
        year = `${yearSegment[2]}${yearSegment[3]}`;
    }

    return `${day}/${month}/${year}`;
}

// condition date
function dateCondition(date) {
    const dateSystem = new Date();
    let day = dateSystem.getDate();
    let month = (dateSystem.getMonth() + 1);
    let year = dateSystem.getFullYear().toString();

    if (year.length === 4) {
        let yearSegment = year.split('')
        year = `${yearSegment[2]}${yearSegment[3]}`;
    }

    let dateSegment = date.split("/");

    if (parseInt(dateSegment[2]) < parseInt(year))
        return false;

    if (parseInt(dateSegment[2]) === parseInt(year)) {
        if (parseInt(dateSegment[1]) < month)
            return false;
        if (parseInt(dateSegment[1]) === month) {
            if (parseInt(dateSegment[0]) <= day)
                return false;
        }
    }
    return true;
}

module.exports = {dateNow, dateCondition};