

function handleMessage(mess){
    
    if(typeof mess.result != "undefined"){
        // Message is a response to last request
        switch(lastRequest.method){
            case 'Server.GetStatus':
                //get all groups
                groups = mess.result.server.groups;
                groups.forEach(group => {
                    // Get clients of the group
                    group.clients.forEach(client => {
                        // Save connected clients
                        if(client.connected){
                            cli = new Client(client);
                            connectedClients.set(cli.id, cli);
                        }
                    } )
                });

                console.log(connectedClients);
                break;
            default:
                console.log(mess);
        }
    }
    
    else {
        // Message is a notification
        // Something has changed in the network
        switch(mess.method){
            case "Client.OnVolumeChanged":
                // Volume change

                // Check if id is connected
                id = mess.params.id;
                if(connectedClients.has(id)){
                    // update volume to new
                    cli = connectedClients.get(id);

                    cli.volume = mess.params.volume.percent;
                    cli.muted = mess.params.volume.muted;
                    
                    console.log(cli.name + " vol: " + cli.volume + ", muted: " + cli.muted);
                }
                break;
            case "Client.OnConnect":
                // New connected client
                cli = new Client(mess.params.client);
                connectedClients.set(cli.id, cli)

                console.log(cli.name + " Connected");
                break;
            
            case "Client.OnDisconnect":
                // Remove client from connected list
                cli = connectedClients.get(mess.params.id);
                connectedClients.delete(cli.id);

                console.log(cli.name + " Disconnected") 
                break;

            default:
                console.log(mess);
        }
    }
}

class Client {
    constructor(clientObj){
        this.id = clientObj.id;
        this.name = clientObj.host.name;
        this.volume = clientObj.config.volume.percent;
        this.muted = clientObj.config.volume.muted;
    }
}
