class librespot {
    constructor(url){
        this.url = url;

        fetch("http://" + url + "/web-api/v1/me/player", {method: "GET", mode: "cors"})
            .then(response => {
                if(response.status == 200){
                    return response.json();
                }else{
                    this.url = url;
                    this.track = null;
                    this.volume = "";
                    this.status = "stopped";
                    return null;
                }
            })
            .then(data => {

                if(data == null){
                    this.updateDisplay();
                    return;
                }

                this.volume = data.device.volume_percent;
                this.track = data.item;
                this.status = data.is_playing ? "playing" : "paused";
                this.updateDisplay();
                return;
            })
    }


    handleMessage(mess){
        var handled = true;
        switch (mess.event) {
            case "metadataAvailable":
                this.track = mess.track;
                break;

            case "volumeChanged":
                this.volume = mess.value;
                break;

            case "playbackPaused":
                this.status = "paused";
                break;
            
            case "playbackResumed":
                this.status = "playing";
                break;
            
            case "inactiveSession":
                this.status = "stopped";
                break;

            default:
                handled = false;
                break;
        }

        if(handled){
            this.updateDisplay();
        }


    }

    updateDisplay() {
        console.log(this);

        if(this.status != "stopped"){
            console.log(this.status + " : " + this.track.name + " at volume " + this.volume);
        }
    }
}