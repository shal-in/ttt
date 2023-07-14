socket = io()

const currentURL = window.location.href;
const gameid = currentURL.split('/').pop();
let playerid;

console.log(gameid)

socket.on('connection_response', function(data) {
    let sessionid = data.sessionid;
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
    members = data.members
    console.log(data);
    if (!playerid) {
    playerid = data.playerid;
    console.log(`you are ${playerid}`)
    }
})