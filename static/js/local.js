let headerTextEl = document.getElementById('header-text');
headerTextEl.addEventListener('click', () => {
    let result = window.confirm('are you sure you want to exitgum-rap-ice?\n\ncurrent game will end')
    if (result) {
        window.location.href = '/';
    }

})

let gridsEl = Array.from(document.getElementsByClassName('grid'))
gridsEl.forEach(grid => grid.addEventListener('click', boxClicked));

let restartBtnEl = document.getElementById('restart-btn')
restartBtnEl.addEventListener('click', restartBtnFunction);

let spaces = Array(9).fill(null);
let currentPlayer = 1;
let turnCount = 0;
let themesIndex = 0;
let winningSquares = null;

function boxClicked(e) {
    const id = e.target.id;
    if (!spaces[id]) {
        gridsEl[id].style.cursor = 'default'
        spaces[id] = currentPlayer;
        if (currentPlayer == 1) {
            gridText = "X";
        }
        else {
            gridText = "O";
        }
        e.target.innerText=gridText;
        turnCount ++;

        winnerText = document.getElementById('header-text');
        if (checkIfWinner() !== false) {
            winnerText.textContent = `${gridText} wins!`;
            winningSquares = checkIfWinner();
        }
        
        else {
            if (turnCount >= 9){
            winnerText.textContent = `draw!`
            }
        }

        if (currentPlayer == 1) {
            currentPlayer = 2;
        }
        else {
            currentPlayer = 1;
        }
    }
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
        [a,b,c] = winningCombos[i]
        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            gridsEl.forEach(grid => grid.removeEventListener('click',boxClicked));
            return [a,b,c]
        }
    }
    return false
}

function restartBtnFunction() {
    let result;
    if (!winningSquares) {
        result = window.confirm('are you sure you want to restart?')
    }
    else {
        result = true
    }
    if (result) {
        spaces.fill(null);
        gridsEl.forEach(grid => {
            grid.innerHTML = '';
            grid.style.backgroundColor = '';
            grid.style.cursor = 'pointer'
        });
        gridsEl.forEach(grid => grid.addEventListener('click',boxClicked));
        currentPlayer = 1;
        turnCount = 0;
        winnerText = document.getElementById('header-text');
        winnerText.textContent = 'tic tac toe'
        winningSquares = null;
    }
};

function toggleTheme() {
    themesIndex++;
    if (themesIndex >= themes.length){
        themesIndex = 0;
    }
    theme = themes[themesIndex];
    root.style.setProperty('--background',theme[1]);
    root.style.setProperty('--primary-color',theme[2]);
    root.style.setProperty('--secondary-color',theme[3]);
    root.style.setProperty('--winningSquares',theme[4]);
    if (theme.length == 6) {
        root.style.setProperty('--mainFont',theme[5])
    }
    winningColor = themes[themesIndex][4]
    if (winningSquares !== null) {
        for (let i=0; i<winningSquares.length; i++) {
            gridsEl[winningSquares[i]].style.backgroundColor = winningColor;
        }
    }
}
