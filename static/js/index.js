const titleBtnEl = document.getElementById('title-btn');

const startBtns = document.querySelectorAll('.start-btn');
const localBtnEl = startBtns[0]
const createBtnEl = startBtns[1]
const joinBtnEl = startBtns[2]

const btnContainerEl = document.getElementById('btn-container');
const inputContainerEl = document.getElementById('input-container'); 

const gameInputEl = document.createElement('input');
const playBtnEl = document.createElement('button');

titleBtnEl.addEventListener('click', function titleBtnFunction() {
    window.open('https://github.com/shal-in/', "_blank");
});

localBtnEl.addEventListener('click', localBtnFunction);

createBtnEl.addEventListener('click', createBtnFunction);

joinBtnEl.addEventListener('click', joinBtnFunction);

function localBtnFunction() {
    console.log('local');
}

function createBtnFunction() {
    console.log('create')
}

function joinBtnFunction() {
    event.stopPropagation()

    startBtns.forEach((btn) => {
        btn.style.backgroundColor = 'blue';
    });

    gameInputEl.id = 'game-input';
    gameInputEl.placeholder = 'add game ID';

    playBtnEl.id = 'play-btn';
    playBtnEl.textContent = 'play';
    playBtnEl.addEventListener('click', () => playBtnFunction(gameInputEl));
    
    gameInputEl.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            playBtnFunction(gameInputEl);
        }
    });

    inputContainerEl.appendChild(gameInputEl);
    inputContainerEl.appendChild(playBtnEl);

    localBtnEl.removeEventListener('click', localBtnFunction);
    createBtnEl.removeEventListener('click', createBtnFunction);
    joinBtnEl.removeEventListener('click', joinBtnFunction);
    
    btnContainerEl.addEventListener('click', btnContainerFunction)
}

function btnContainerFunction() {
    console.log('test')
    gameInputEl.remove();
    playBtnEl.remove();

    localBtnEl.addEventListener('click', localBtnFunction);
    createBtnEl.addEventListener('click', createBtnFunction);
    joinBtnEl.addEventListener('click', joinBtnFunction);

    startBtns.forEach((btn) => {
        btn.style.backgroundColor = 'red';
    });

    btnContainerEl.removeEventListener('click', btnContainerFunction)
}

function playBtnFunction(inputEl) {
    console.log('play');
    let gameInputValue = inputEl.value;
    if (gameInputValue) {
        console.log(gameInputValue);
    }
}