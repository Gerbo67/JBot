// get random number
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {getRandomArbitrary};