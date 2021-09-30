function getLevel(nMsg) {
    let x = 20;

    let flag = true;

    for (let i = 1; flag; i++) {
        if (nMsg >= x) {
            x = (20 * (i + 1)) + x;
            if (nMsg < x) {
                flag = false;
                return i;
            }
        } else {
            flag = false;
            return 0;
        }
    }
}

function getInt(number) {
    if (number % 1 == 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {getLevel, getInt};