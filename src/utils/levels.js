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

function getLimits(nMsg) {
    let x = 20;
    let y = 0;

    let flag = true;

    for (let i = 1; flag; i++) {
        if (nMsg >= x) {
            x = (20 * (i + 1)) + x;
            y = (20 * (i)) + y;
            if (nMsg < x) {
                flag = false;
                return [i, x, y];
            }
        } else {
            flag = false;
            return [0, x, y];
        }
    }
}

module.exports = {getLevel, getInt, getLimits};