out = document.getElementById("content")


const lastRequest = {
    'id': 0,
    'jsonrpc': '2.0',
    'method': 'Server.GetStatus',
};

var lastData

// Map {id: Client, id: Client}
var connectedClients = new Map();

// Create websocket
const snapsock = new WebSocket("ws://192.168.1.121:1780/jsonrpc");
// Handle responses
snapsock.addEventListener("message", (message) => {
    handleMessage(JSON.parse(message.data));
})

// Send "Server.GetStatus" request when socket is opened
snapsock.addEventListener('open', () => snapsock.send(JSON.stringify(++lastRequest.id && lastRequest)));


