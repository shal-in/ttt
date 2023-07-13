const socket = io();
let sessionid;
let gameid;

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
}

function createBtnFunction() {
    console.log('create');

    socket.emit('create');
}

function joinBtnFunction(inputEl) {
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
  