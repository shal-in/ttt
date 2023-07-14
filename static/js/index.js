const socket = io();
let sessionid;
let gameid;

let join_errorMsg = localStorage.getItem('join_error');
if (join_errorMsg) {
    alert(join_errorMsg);
}
localStorage.removeItem('join_error');

const titleBtnEl = document.getElementById('subheader-btn');
const localBtnEl = document.getElementById('local-btn');
const createBtnEl = document.getElementById('create-btn');
const joinBtnEl = document.getElementById('join-btn');
const gameInputEl = document.getElementById('join-input');

titleBtnEl.addEventListener('click', function titleBtnFunction() {
    window.open('https://github.com/shal-in/', '_blank');
});
localBtnEl.addEventListener('click', localBtnFunction);
createBtnEl.addEventListener('click', createBtnFunction);
joinBtnEl.addEventListener('click', joinBtnFunction);
gameInputEl.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        joinBtnFunction(gameInputEl);
    }
});

function localBtnFunction() {
    console.log('local');
    
    window.location.href = '/local';
}

function createBtnFunction() {
    console.log('create');

    socket.emit('create');
}

function joinBtnFunction(inputEl) {
    console.log('join');
    gameid = inputEl.value;
    inputEl.value = '';
    if (!gameid) {
        alert('please input a game code');
    }
    if (gameid) {
        if (gameid.length !== 11) {
            alert('invalid game code');
            return;
        } 

        payLoad = {
            'gameid': gameid
        };

        socket.emit('join', payLoad);
    }
}

socket.on('create_response', function(data) {
    gameid = data.gameid;
    if (!gameid) {
        alert('error in creating game. please refresh and try again');
        return;
    }
    copyToClipboard(gameid);
    window.location.href = `/${gameid}`;
});

socket.on('join_error', function(data) {
    alert(data.message);
    gameid;
})

socket.on('join_response', function(data) {
    gameid = data.gameid;
    window.location.href = `/${gameid}`;
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
  