'use strict'
var gBoard = [];
var gLevel = {
    size: choseLevel(),
    mines: 0
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const EMPTY = '';
const MINE = '💣';
const RED_FLAG = '🚩';

function init() {
    gGame.isOn = true;
    gLevel.size = choseLevel()
    if (gLevel.size === 4) gLevel.mines = 2
    if (gLevel.size === 8) gLevel.mines = 12
    if (gLevel.size === 12) gLevel.mines = 30
    gBoard = buildBoard(gLevel.size)
    renderBoard(gLevel.size)
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    minesCounter = 0
    document.querySelector('.smiley').innerHTML = '🙂'
}


function choseLevel() {
    var chosenLevel;
    var Beginner = document.getElementById('4')
    var Medium = document.getElementById('8')
    var Expert = document.getElementById('12')
    if (Beginner.checked) chosenLevel = +Beginner.id;
    if (Medium.checked) chosenLevel = +Medium.id;
    if (Expert.checked) chosenLevel = +Expert.id
    return chosenLevel
}

function buildBoard(level) {
    // var size = level;
    var board = [];
    for (var i = 0; i < level; i++) {
        board.push([])
        for (var j = 0; j < level; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board;
}


function renderBoard(level) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < level; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < level; j++) {
        var cell = gBoard[i][j];
        var neighbors = setMinesNegsCount(gBoard, i, j)
        if (!cell.isMine) {
            strHTML += `<td data-i="${i}" data-j="${j}" value="empty" onclick="cellClicked(${i},${j},this)" oncontextmenu="putFlag(${i},${j},this)">${(neighbors === 0)? EMPTY: neighbors}</td>`
        } else {
            strHTML += `<td data-i="${i}" data-j="${j}" value="mine" onclick="cellClicked(${i},${j},this)" oncontextmenu="putFlag(${i},${j},this)">${MINE}</td>`
        }
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elboard = document.querySelector('.board');
    elboard.innerHTML = strHTML;
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var minedNegsCounter = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) {
                minedNegsCounter++
            }
        }
    }
    return minedNegsCounter
}

function cellClicked(idxI,idxJ,element) {
    // evoid opening new cells if the game end:
    if (!gGame.isOn) return
    checkIfWinnig(gLevel.mines)
    if (!gBoard[idxI][idxJ].isMarked && !gBoard[idxI][idxJ].isMine) {
        // debugger
        gGame.shownCount++
        element.style.fontSize = '30px'
        gBoard[idxI][idxJ].isShown = true
        element.style.backgroundColor = 'rgb(202, 199, 199)'
        if (gGame.shownCount === 1) {
            creatMines()
            console.log(minesCounter)
            return
        }
        for (var i = idxI - 1; i <= idxI + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue
            for (var j = idxJ - 1; j <= idxJ + 1; j++) {
                if (j < 0 || j > gBoard.length - 1) continue
                if (i === idxI && j === idxJ) continue
                if (gBoard[i][j].isShown) continue
                if (!gBoard[i][j].isMine) {
                    var currNeighbor = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    currNeighbor.style.fontSize = '30px'
                    currNeighbor.style.backgroundColor = 'rgb(202, 199, 199)'
                    currNeighbor.innerHTML = (+setMinesNegsCount(gBoard, i, j) !== 0) ? +setMinesNegsCount(gBoard, i, j) : '';
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                }
            }
        }
    }
    if (gBoard[idxI][idxJ].isMine) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) {
                    console.log('i', i)
                    console.log('j', j)
                    var currMinedCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    if (gBoard[i][j].isMarked) currMinedCell.innerHTML = MINE;
                    gBoard[i][j].isShown = true
                    currMinedCell.style.fontSize = '30px'
                    currMinedCell.style.backgroundColor = 'rgb(202, 199, 199)'
                    gameOver()
                }
            }
        }
    }
    
}


function putFlag(idxI,idxJ,element) {
    event.preventDefault();  
    checkIfWinnig(gLevel.mines)
    if (!gGame.isOn) return
    if (!gBoard[idxI][idxJ].isMarked && !gBoard[idxI][idxJ].isShown) {
        element.innerHTML = RED_FLAG
        element.style.fontSize = '30px'
        gBoard[idxI][idxJ].isMarked = true
        gGame.markedCount++
        checkIfWinnig(gLevel.mines)
        return
        //unflag:
    } else if(gBoard[idxI][idxJ].isMarked && !gBoard[idxI][idxJ].isShown) {
        element.style.fontSize = '0px'
        gBoard[idxI][idxJ].isMarked = false
        gGame.markedCount--
        if (gBoard[idxI][idxJ].isMine) {
            element.innerHTML = MINE
        } else {
            element.innerHTML = (+setMinesNegsCount(gBoard, idxI, idxJ) !== 0) ? +setMinesNegsCount(gBoard, idxI, idxJ) : '';
        }
        return
    }
}

var minesCounter = 0
function creatMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        var randomSpot = getRandomLocation(gLevel.size)[0]
        if (!gBoard[randomSpot.i][randomSpot.j].isShown) {
            gBoard[randomSpot.i][randomSpot.j].isMine = true;
            var currCell = document.querySelector(`[data-i="${randomSpot.i}"][data-j="${randomSpot.j}"]`)
            currCell.innerHTML = `${MINE}`
            minesCounter++
        }  
    }
    return 
}

//losing:
function gameOver() {
    console.log('Geme over!')
    gGame.isOn = false;
    document.querySelector('.smiley').innerHTML = '☹️ Game over'
}
//Victory:
function gameEnd() {
    gGame.isOn = false;
    document.querySelector('.smiley').innerHTML = '🥳 You win! Game end'
}

function checkIfWinnig() {
    for (var i = 0; i < gLevel.size-1; i++) {
        for (var j = 0; j < gLevel.size-1; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) return
        }
    }
    if (gGame.markedCount === minesCounter && gGame.shownCount === (gLevel.size*gLevel.size) - minesCounter) gameEnd()
}

