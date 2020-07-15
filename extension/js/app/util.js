function getRandomElement(array) {
    let randomIndex = Math.floor((Math.random() * array.length));
    return array[randomIndex];
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getRandomElements(n, array) {
    shuffleArray(array)
    return array.slice(0, n)
}