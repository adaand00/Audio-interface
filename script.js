out = document.getElementById("content")

addr = "192.168.1.121";

var lastRequest = {
    'id': 0,
    'jsonrpc': '2.0',
    'method': 'Server.GetStatus',
};

var lastData

// Map {id: Client, id: Client}
var connectedClients = new Map();

// Create websocket
const snapsock = new WebSocket("ws://" + addr + ":1780/jsonrpc");
// Handle responses
snapsock.addEventListener("message", (message) => {
    handleMessage(JSON.parse(message.data));
})

// Send "Server.GetStatus" request when socket is opened
snapsock.addEventListener('open', () => snapsock.send(JSON.stringify(++lastRequest.id && lastRequest)));

// create socket for spotify
const spotsock = new WebSocket("ws://" + addr + ":24879/events");
// spotify state handler

spot = new librespot(addr + ":24879")

spotsock.addEventListener("message", (message) => {
    spot.handleMessage(JSON.parse(message.data));
})


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("playPause").onclick = function() {spot.sendPlayPause()};
    document.getElementById("nextSong").onclick = function() {spot.sendNext()};
    document.getElementById("previousSong").onclick = function() {spot.sendPrevious()};
    document.getElementById("spotMute").onclick = function() {spot.sendMute()};
    document.getElementById("spotVolume").oninput = function() {spot.sendVolume()};

    connectedClients.forEach((client) => { client.addDiv()})
})

