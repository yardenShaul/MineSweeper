'use strict'


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomLocation(level) {
    var arr = []
    for (var i = 0; i < level; i++) {
        arr[i] = []
        for (var j = 0; j < level; j++) {
            arr[i][j] = {i: i, j:j}
        }
    }
    
    var randIdx = getRandomInt(0,level)
    var randomLocation = arr[getRandomInt(0,level)].splice([randIdx],1)
    return randomLocation
}

