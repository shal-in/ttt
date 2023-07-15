from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit
import secrets
import random

# create a Flask and socketIO app
app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'secret_key'
socketio = SocketIO(app)

def generate_gameid():
    words = [
        'ace', 'add', 'age', 'air', 'ale', 'and', 'ant', 'ape', 'apt', 'ark',
        'bad', 'ban', 'bat', 'bed', 'bee', 'big', 'bin', 'bit', 'boa', 'bug',
        'cab', 'cam', 'cap', 'car', 'cat', 'cob', 'cod', 'cot', 'cow', 'cue',
        'dad', 'dam', 'day', 'den', 'dew', 'did', 'dig', 'dim', 'doe', 'dog',
        'ear', 'eat', 'egg', 'elf', 'elk', 'end', 'eon', 'era', 'eve', 'eye',
        'fad', 'fan', 'far', 'fat', 'fig', 'fin', 'fit', 'fix', 'fly', 'fog',
        'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gig', 'gin', 'god', 'gum',
        'had', 'ham', 'hat', 'hen', 'hey', 'hid', 'hip', 'hit', 'hot', 'hug',
        'ice', 'ink', 'ion', 'ire', 'ivy', 'jab', 'jam', 'jar', 'jaw', 'jet',
        'keg', 'key', 'kid', 'kit', 'lab', 'lap', 'law', 'lay', 'leg', 'let',
        'mad', 'man', 'map', 'mat', 'met', 'mug', 'mum', 'nab', 'nap', 'net',
        'oak', 'odd', 'off', 'oil', 'old', 'one', 'orb', 'owe', 'owl', 'own',
        'pad', 'pan', 'pea', 'peg', 'pen', 'per', 'pet', 'pig', 'pin', 'pod',
        'qua', 'rag', 'ram', 'ran', 'rap', 'red', 'rib', 'rid', 'rig', 'rim',
        'sag', 'sap', 'sat', 'sea', 'see', 'set', 'sin', 'sip', 'sir', 'ski',
        'tab', 'tan', 'tap', 'tar', 'tea', 'ten', 'tie', 'tin', 'tip', 'top',
        'urn', 'use', 'van', 'vat', 'vet', 'via', 'web', 'wet', 'wig', 'win',
        'yak', 'yam', 'yap', 'yen', 'yes', 'yet', 'yew', 'yin', 'yip', 'zap'
    ]

    nums = []
    selected = []
    gameid = ''
    for i in range(3):
        num = num = random.randint(0, len(words) - 1)
        while num in nums:
            num = random.randint(0, len(words) - 1)
        nums.append(num)
        word = words[num]

        if i == 2:
            gameid = gameid + word
        else:
            gameid = gameid + word + '-'

    return gameid

rooms = {}

# define routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/local')
def local():
    return render_template('local.html')

@app.route('/online')
def online():
    return render_template('online.html')

@app.route('/<gameid>')
def game_page(gameid):
    return render_template('online.html')

# define socketio events
@socketio.on('connect')
def on_connect():
    sessionid = request.sid
    session['sessionid'] = sessionid
    emit('connection_response', { 'sessionid': sessionid })

@socketio.on('create')
def on_create():
    gameid = generate_gameid()
    while gameid in rooms:
            gameid = generate_gameid()
    room = {
        'members': [], # [sessionid, playerid]
        'moves': [] # [playerid, move]
    }
    rooms[gameid] = room
    emit('create_response', { 'gameid': gameid })

@socketio.on('game_connect')
def on_game_connect(data):
    sessionid = request.sid
    gameid = data['gameid']

    if gameid not in rooms: # invalid gameid
        emit('join_error', { 'message': 'invalid gameid' })
        return

    members = rooms[gameid]['members']
    if len(members) == 2: # game lobby full
        emit('join_error', { 'message': 'game lobby full' })
        return
    
    if len(members) == 0:
        playerid = 'X'
    elif len(members) == 1:
        playerid = 'O'
    members.append([sessionid, playerid])

    moves = rooms[gameid]['moves']
    for member in members:
        sessionid = member[0]
        playerid = member[1]
        payLoad = { 'playerid': playerid, 'moves': moves }
        emit('game_connect_response', payLoad, room=sessionid)


@socketio.on('join')
def on_join(data):
    gameid = data['gameid']

    if gameid not in rooms:
        emit('join_error', { 'message': 'invalid gameid' })
        return
    
    room = rooms[gameid]
    if len(room['members']) == 2:
        emit('join_error', { 'message': 'game lobby full' })
        return

    emit('join_response', { 'gameid': gameid })
    
@socketio.on('play')
def on_play(data):
    sessionid = request.sid
    gameid = data['gameid']
    move = data['move']
    moves = rooms[gameid]['moves']
    moves.append(move)

    payLoad = { 'move': move }

    members = rooms[gameid]['members']
    for member in members:
        emit('play_response', payLoad, room=member[0])






# run the Flask app
if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)