const RcpToPlay = () => {
	
	ipcRenderer.send('RpcToPlay');
	ctrl.href = 'javascript:RcpToPause()';
}
const RcpToPause = () => {
	
	ipcRenderer.send('RpcToPause');
	ctrl.href = 'javascript:RcpToPlay()';
}

ctrl.onclick = RcpToPlay;