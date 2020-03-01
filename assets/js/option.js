const { ipcRenderer } = require('electron');
let config = require('../config.json');

RpcCheck();
NtcCheck();

/*------[Open Options]------*/

function openOptions() {
	ipcRenderer.send('openOptions');
}
	
/*------[RPC]------*/

function RpcCheck() {
	if (config.rpc === false) {
		document.getElementById('rpc-btn').href = 'javascript:RpcOn()';
		document.getElementById('rpc-btn').innerHTML = 'Discord Rpc: Off';
	}
}
function RpcOff() {
	ipcRenderer.send('editRpc', false);
	document.getElementById('rpc-btn').href = 'javascript:RpcOn()';
	document.getElementById('rpc-btn').innerHTML = 'Discord Rpc: Off';
}
function RpcOn() {
	ipcRenderer.send('editRpc', true);
	document.getElementById('rpc-btn').href = 'javascript:RpcOff()';
	document.getElementById('rpc-btn').innerHTML = 'Discord Rpc: On';
}

/*---[NOTIFICATIONS]---*/

function NtcCheck() {
	if (config.notifier === false) {
		document.getElementById('ntf-btn').href = 'javascript:NtfOn()';
		document.getElementById('ntf-btn').innerHTML = 'Discord Rpc: Off';
	}
}
function NtfOff() {
	ipcRenderer.send('editNtf', false);
	document.getElementById('ntf-btn').href = 'javascript:NtfOn()';
	document.getElementById('ntf-btn').innerHTML = 'Notifications: Off';
}
function NtfOn() {
	ipcRenderer.send('editNtf', true);
	document.getElementById('ntf-btn').href = 'javascript:NtfOff()';
	document.getElementById('ntf-btn').innerHTML = 'Notifications: On';
}