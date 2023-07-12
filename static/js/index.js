const socket = io();
let sessionid;
let gameid;

const titleBtnEl = document.getElementById('title-btn');
const startBtns = document.querySelectorAll('.start-btn');
const localBtnEl = startBtns[0];
const createBtnEl = startBtns[1];
const joinBtnEl = startBtns[2];
const btnContainerEl = document.getElementById('btn-container');
const inputContainerEl = document.getElementById('input-container');
const gameInputEl = document.getElementById('game-input');
const playBtnEl = document.getElementById('play-btn');


titleBtnEl.addEventListener('click', function titleBtnFunction() {
    window.open('https://github.com/shal-in/', '_blank');
});
localBtnEl.addEventListener('click', localBtnFunction);
createBtnEl.addEventListener('click', createBtnFunction);
joinBtnEl.addEventListener('click', joinBtnFunction);
playBtnEl.addEventListener('click', () => playBtnFunction(gameInputEl));   
gameInputEl.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        playBtnFunction(gameInputEl);
    }
});

function localBtnFunction() {
    console.log('local');

    payLoad = {
        key: 'value'
    }
    socket.emit('local', payLoad);
}

function createBtnFunction() {
    console.log('create');

    socket.emit('create');
}

function joinBtnFunction() {
    event.stopPropagation();

    startBtns.forEach((btn) => {
        btn.style.backgroundColor = 'blue';
    });

    inputContainerEl.style.display = 'flex'

    localBtnEl.removeEventListener('click', localBtnFunction);
    createBtnEl.removeEventListener('click', createBtnFunction);
    joinBtnEl.removeEventListener('click', joinBtnFunction);
    btnContainerEl.addEventListener('click', btnContainerFunction);

    gameInputEl.focus()
}

function btnContainerFunction() {
    startBtns.forEach((btn) => {
        btn.style.backgroundColor = 'red';
    });

    inputContainerEl.style.display = 'none';

    localBtnEl.addEventListener('click', localBtnFunction);
    createBtnEl.addEventListener('click', createBtnFunction);
    joinBtnEl.addEventListener('click', joinBtnFunction);
    btnContainerEl.removeEventListener('click', btnContainerFunction);
}

function playBtnFunction(inputEl) {
    console.log('play');
    gameid = inputEl.value;
    if (gameid) {
        inputEl.value = '';
        if (gameid.length !== 11) {
            alert('invalid gameid');
            return;
        } 

        payLoad = {
            'gameid': gameid
        };

        socket.emit('join', payLoad);
    }
}

socket.on('connection_response', function(data) {
    sessionid = data.sessionid;
    console.log(`sessionid: ${sessionid}`);
});

socket.on('create_response', function(data) {
    gameid = data.gameid;
    console.log(`gameid: ${gameid}`);
    copyToClipboard(gameid);
});

socket.on('join_error', function(data) {
    alert(data.message);
    gameid;
})

socket.on('join_response', function(data) {
    console.log(`${gameid} joined successfully`);
    console.log(data.message)
})










function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
  
      textarea.select();
      document.execCommand('copy');
  
      document.body.removeChild(textarea);
    }
  }
  