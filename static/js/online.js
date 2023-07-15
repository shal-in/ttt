socket = io()

const currentURL = window.location.href;
const gameid = currentURL.split('/').pop();
let playerid;
let moves;
let move;
let spaces = Array(9).fill(null);
let turnCount = 0;
let currentPlayer;
let winningSquares;

let gridsEl = Array.from(document.getElementsByClassName('grid'));

socket.on('connection_response', function(data) {
    let sessionid = data.sessionid;
    localStorage.setItem('sessionid', sessionid);
    console.log(sessionid);
})

socket.on('join_error', function(data) {
    localStorage.setItem('join_error', data.message);
    window.location.href = '/';
})

payLoad = {
    'gameid': gameid
}
socket.emit('game_connect', payLoad);

socket.on('game_connect_response', function(data) {
    if (!playerid) {
    playerid = data.playerid;
    console.log(`you are ${playerid}`);
    }
    moves = data.moves;

    if (moves.length === 0) {
        currentPlayer = 'X'
    }
    else {
        move = moves[moves.length - 1]
        let movePlayerid = move[0];
        let moveGrid = move[1];
        spaces[moveGrid] = movePlayerid;
        gridsEl[moveGrid].innerText = movePlayerid;
        currentPlayer = 'O'
    }

    if (currentPlayer === playerid) {
        for (let i=0; i < spaces.length; i++) {
            if (spaces[i] === null) {
                gridsEl[i].addEventListener('click', boxClicked);
            }
        }
    }
})

socket.on('play_response', function(data) {
    move = data.move; // [playerid, move]
    let movePlayerid = move[0];
    let moveGrid = move[1];
    spaces[moveGrid] = movePlayerid;
    gridsEl[moveGrid].innerText = movePlayerid;

    turnCount = 0;
    for (let i=0; i < spaces.length; i++) {
        if (spaces[i] !== null) {
            turnCount ++;
        }
    }

    if (checkIfWinner() !== false) {
        // winner
        winningSquares = checkIfWinner();
        console.log(`${movePlayerid} wins by ${winningSquares}`);
    }
    else {
        if (turnCount === 9) {
        // draw
        console.log('draw');
        }
        else if (movePlayerid !== playerid) {
            for (let i=0; i < spaces.length; i++) {
                if (spaces[i] === null) {
                    gridsEl[i].addEventListener('click', boxClicked);
                }
            }
        }
    }

})

function boxClicked(e) {
    const id = e.target.id

    for (let i=0; i < spaces.length; i++) {
        if (spaces[i] === null) {
            gridsEl[i].removeEventListener('click', boxClicked);
        }
    }

    payLoad = {'gameid': gameid,
            'move': [playerid, id]}
    socket.emit('play', payLoad);
}

function checkIfWinner() {
    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    
    for (let i = 0; i < winningCombos.length; i++) {
        [a,b,c] = winningCombos[i];
        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            gridsEl.forEach(grid => grid.removeEventListener('click',boxClicked));
            return [a,b,c]
        }
    }
    return false
}