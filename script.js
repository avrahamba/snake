'use strict';

var gHead = null;
var gBoard = null;
var gTail = 3;
var gDirection = 'ArrowUp';
var gInterval = null;
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
play();
function play() {
    gBoard = createBoard();
    renderBoardFirst();
    renderBoard();
    document.addEventListener('keydown', changeMove);
    renderBoard(gBoard);
    createApple();
    gInterval = setInterval(step, 100);
}
function step() {
    switch (gDirection) {
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
    }
    refreshBoard();
    if (isEating()) {
        createApple()
    }
    renderBoard(gBoard);
    if (isDie()) {
        clearInterval(gInterval);
        gBoard = createBoard();
        var surce = gTail - 3;
        gTail = 3;
        gDirection = 'ArrowUp';
        alert(`Game Over\nThe surce is: ${surce}`);
    }
}

function createApple() {
    var emptyCell = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.apple) cell.apple = false;
            if (!(cell.isHead || cell.tail)) {
                emptyCell.push({ i: i, j: j });
            }
        }
    }
    var cell = emptyCell[getRandomInt(0, emptyCell.length)];
    gBoard[cell.i][cell.j].apple = true;
    gTail++;
}
function isEating() {
    if (gBoard[gHead.i][gHead.j].apple) return true;
    return false;
}
function isDie() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isHead && cell.tail) {
                return true;
            }
        }
    }
    return false;
}

function changeMove(e) {

    switch (e.key) {
        case 'ArrowUp':
            if (gDirection === 'ArrowDown') return;
            gDirection = e.key;
            break;
        case 'ArrowDown':
            if (gDirection === 'ArrowUp') return;
            gDirection = e.key;
            break;
        case 'ArrowLeft':
            if (gDirection === 'ArrowRight') return;
            gDirection = e.key;
            break;
        case 'ArrowRight':
            if (gDirection === 'ArrowLeft') return;
            gDirection = e.key;
            break;
        case 'Escape':
            clearInterval(gInterval);
    }
    step();
}
function moveUp() {
    gHead.i--;
    if (gHead.i === -1) gHead.i = gBoard.length - 1;
}
function moveDown() {
    gHead.i++;
    if (gHead.i === gBoard.length) gHead.i = 0;
}
function moveLeft() {
    gHead.j--;
    if (gHead.j === -1) gHead.j = gBoard.length - 1;
}
function moveRight() {
    gHead.j++;
    if (gHead.j === gBoard.length) gHead.j = 0;
}

function refreshBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.tail === gTail) {//End the tail
                cell.tail = 0;
            } else if (cell.isHead) {
                cell.isHead = false;
                cell.tail++;
            } else if (cell.tail) {
                cell.tail++;
            }
            if (i === gHead.i && j === gHead.j) {
                cell.isHead = true;
            }
        }
    }
}

function createBoard(size = 60) {
    var onHead = false;
    var mat = [];
    for (var i = 0; i < size; i++) {
        mat.push([]);
        for (var j = 0; j < size; j++) {
            if (!onHead && i ===parseInt( size / 2) && j ===parseInt( size / 2)) {
                onHead = false;
                gHead = { 'i': i, 'j': j };
                mat[i][j] = createCell(true);
            } else {
                mat[i][j] = createCell(false);
            }
        }
    }
    return mat;
}
function createCell(isHead) {
    var cell = {
        isHead: isHead,
        tail: 0,
        apple: false
    };
    return cell;
}
function renderBoardFirst() {
    var tableHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            {
                tableHtml += `<div id='i${i}j${j}' class='red'></div>`;
            }
        }
        tableHtml += `<div class='end'></div>`;
    }
    var table = document.getElementById('table');
    table.innerHTML=tableHtml;
}
function renderBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elm = document.getElementById('i' + i + 'j' + j);
            if (gBoard[i][j].isHead || gBoard[i][j].tail) {
                if(elm.className !== 'dark')
                elm.className = 'dark';
            }
            else if (gBoard[i][j].apple) {
                if(elm.className !== 'green')
                elm.className = 'green';
            }
            else {
                if(elm.className !== 'red')
                elm.className = 'red';
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
