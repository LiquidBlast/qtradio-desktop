/*
NEVER EVER EVER TOUCH THIS CODE,
I SAY: N E V E R,
This shit is just cursed, no touchy this is a fucky wucky kthx
*/

let yourAudio     = document.getElementById('videoElement'),
    ctrl          = document.getElementById('audioControl'),
	audioPlaying  = false;	
	
const RcpToPlay = () => {
	ipcRenderer.send('RpcToPlay');
}
const RcpToPause = () => {
	
	ipcRenderer.send('RpcToPause');
}	

ctrl.onclick = function () {

    let pause = ctrl.innerHTML === 'Pause';
    ctrl.innerHTML = pause ? 'Play' : 'Pause';

    let method = pause ? 'pause' : 'play';
    yourAudio[method]();
	
	audioPlaying = audioPlaying ? false : true;
	
	if( audioPlaying ) RcpToPlay();
	else               RcpToPause();

    return false;
};

let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

window.onload = function(){
    let client = new HttpClient();
    client.get('http://64.190.90.143:9090/getSongData', function(res) {
        let obj = JSON.parse(res);
        document.getElementById("nowPlaying").textContent = obj.message.nowPlaying;
    });
}

setInterval(function(){
    let client = new HttpClient();
    client.get('http://64.190.90.143:9090/getSongData', function(res) {
        let obj = JSON.parse(res);
        document.getElementById("nowPlaying").textContent = obj.message.nowPlaying;
    });
}, 5e3);

document.oncontextmenu=RightMouseDown;
function RightMouseDown() { return false; }

let randomInt = (min, max) => { 
   return Math.floor(Math.random() * (max - min + 1)) + min;
};
document.getElementById('background').style.backgroundImage = `url(../assets/img/bgs/${randomInt(1, 6)}.webp`;