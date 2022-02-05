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
                this.volume = Math.round(100 * mess.value);
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
            var artists = [];
            var imgUrl;
            try {
                // From spotify API
                this.track.artists.forEach((art) => {
                    artists.push(art.name)
                });
                imgUrl = this.track.album.images[0].url;
                
            } catch (TypeError) {
                // From librespot API
                this.track.artist.forEach((art) => {
                    artists.push(art.name)
                });
                var imgID = this.track.album.coverGroup.image[2].fileId;
                imgUrl = "https://i.scdn.co/image/" + imgID.toLowerCase();
            }

            this.setTrack(
                this.track.name,
                artists,
                this.track.album.name,
                this.volume,
                imgUrl,
                this.status
                );

        }else{
            this.setTrack(
                "CASE AUDIO",
                "Open spotify and connect to CASELAB wifi to start",
                "",
                0,
                "./defaultcover.png",
                this.status
                );
        }
    }

    setTrack(title, artists, album, volume, imgUrl, status){

        document.getElementById("title").innerHTML = title;
        document.getElementById("subtitle").innerHTML = artists.join(", ") + ": " + album;
        document.getElementById("VolumeSlider").value = volume;
        document.getElementById("spotify").style.backgroundImage = "url('" + imgUrl + "')";
        document.getElementById("playPause").children[0].classList = (status == "playing") ? ["fas fa-pause"] : ["fas fa-play"]

    }
}