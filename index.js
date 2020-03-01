/**
 * @name DeskQT
 * @author qtradio development team
 * @license Closed-Sauce
 * @description very qt
 */

/*---------------[ Declarations ]---------------*/

const fetch                                                    = require('node-fetch');
const notifier                                                 = require('node-notifier');
const { Client, register }                                     = require('discord-rpc');
const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const { writeFile }                                            = require('fs');
const path                                                     = require('path');

/*--------------[ Notification and Option check]-------------------*/

function notify(msg) {
	if ( config.notifier === true ) {
		notifier.notify({ title: 'qtradio.moe', message: msg });
	}
}

/*---------------[ ELECTRON ]---------------*/

const iconPath = path.join(__dirname, 'assets/img/icon.ico');
const appIcon = nativeImage.createFromPath(iconPath);

let win;
const createWindow = () => {
  win = new BrowserWindow({ width: 800, height: 600, icon: appIcon, frame: false }); // Create browser window
  win.loadFile('public/index.html');
  let tray = new Tray(appIcon);

  let contextMenu = Menu.buildFromTemplate([
      {
          label: 'Show', click: function () {
              win.show(); //show that window like a good boye
          }
      },
      {
        label: 'Hide', click: function () {
            win.close(); //show that window like a good boye
        }
     },
      {
          label: 'Quit', click: function () {
              app.isQuiting = true; //quit app if weeb says so
			        notify(`See you next time!`);
              tray.destroy();
              win.close();	
			        process.exit(3);
		  }	  
      }
  ])

 tray.setContextMenu(contextMenu);
 tray.setToolTip('qtradio.moe');

  win.on('close', function (event) {
      event.preventDefault();
	    win.hide();
  });

  win.on('show', function () {
      tray.setHighlightMode('always');
  });

  //win.setMenu( null );

  win.on('closed',  () => win = null); // If window = closed, set to NULL
  
};

app.on('ready', createWindow); //once ready create the window
app.on('activate', () => win === null ? createWindow() : undefined); // Create window if it's NULL and active
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : undefined); // quit the app when requested

/*--------------[ Options menu and Options ]---------------*/

let optWin;
let config = require('./config.json');

ipcMain.on('editRpc', (event, value) => {
	
	config.rpc = value;
	let configJson = JSON.stringify(config, null, 2);
	
	writeFile('config.json', configJson, (err) => {  
	    if (err) {
          notify('Error: Failed to write config');
          console.error(err);
        }
	});
	
	notify('You need to restart qtradio.moe for making the change effective!');
});
ipcMain.on('editNtf', (event, value) => {
	
	config.notifier = value;
	let configJson = JSON.stringify(config, null, 2);
	
	writeFile('config.json', configJson, (err) => {  
		if (err) {
          notify('Error: Failed to write config');
          console.error(err);
        }
	});
});

ipcMain.on('openOptions', (event) => {
	openOptionWin();
});

function openOptionWin() {
  optWin = new BrowserWindow({ width: 400, height: 400, icon: appIcon, frame: false }); // Create browser window
  optWin.loadFile('public/options.html');

  optWin.on('close', function (event) {
      event.preventDefault();
	    optWin.hide();
  });

  optWin.on('show', function () {
      tray.setHighlightMode('always');
  });

  //win.setMenu( null );

  optWin.on('closed',  () => win = null); // If window = closed, set to NULL
}

/*---------------[ DISCORD RPC ]---------------*/

if(config.rpc === true) {
	let playingMoosic = false;
	
	const clientId = '504360789038333963'; // The application's ID for all assets

	register(clientId); // Register the RPC

	const rpc = new Client({ transport: 'ipc' }); // Create the RPC connection
	const startTimestamp = new Date(); // Note the starting timestamp

	let currentSong = null; // Currently playing song

	const setActivity = async() => {
	if (!rpc || !win) return; // If window isn't active nor RPC is return
	
	const getSongConfig = { //Config for getting sngs
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '0.0.0.0'
        }
	}
	const getUrl = 'http://64.190.90.143:9090/getSongData';

	const body = await fetch(getUrl, getSongConfig)  // Get the current song data
                    .then(res => res.json())
                    .then(body => body);

  if (body.message.nowPlaying !== currentSong || playingMoosic === false) {
    currentSong = body.message.nowPlaying; // Update the current song 
    rpc.setActivity({
      details: `Paused Qt Radio`,
      state: `Now Playing: ${body.message.nowPlaying}`,
      largeImageKey: 'qtradio',
      largeImageText: 'Qt Radio Desktop App',
      smallImageKey: 'pause',
      smallImageText: 'Pause',
      instance: false,
      startTimestamp,
    });
  } 
  else if (body.message.nowPlaying !== currentSong || playingMoosic === true) {
	  rpc.setActivity({
      details: `Listening to Qt Radio`,
      state: `Now Playing: ${body.message.nowPlaying}`,
      largeImageKey: 'qtradio',
      largeImageText: 'Qt Radio Desktop App',
      smallImageKey: 'play',
      smallImageText: 'Playing',
      instance: false,
      startTimestamp,
    });
  }
  
  ipcMain.on('RpcToPlay', (event) => {
    rpc.setActivity({
      details: `Listening to Qt Radio`,
      state: `Now Playing: ${body.message.nowPlaying}`,
      largeImageKey: 'qtradio',
      largeImageText: 'Qt Radio Desktop App',
      smallImageKey: 'play',
      smallImageText: 'Playing',
      instance: false,
      startTimestamp,
    });
	playingMoosic = true;
   });
  ipcMain.on('RpcToPause', (event) => {
    rpc.setActivity({
      details: `Idle`,
      state: `Now Playing: ${body.message.nowPlaying}`,
      largeImageKey: 'qtradio',
      largeImageText: 'Qt Radio Desktop App',
      smallImageKey: 'pause',
      smallImageText: 'Paused',
      instance: false,
      startTimestamp,
    });
	playingMoosic = false;
  });

};


rpc.on('ready', () => {
  setActivity(); // Set the user's rich presence
  setInterval(() => setActivity(), 15e3); // Update the user's rich presence every 15 seconds
});

 rpc.login({ clientId }) // Connect to the RPC
    .catch(err => { 
		  notify('Error: Failed to start Discord RPC');
          console.log(err); // Log the error
 });
}