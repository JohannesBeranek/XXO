let w;
const sendQueue = [];

const receiveMessage = (msg) => {
	if (msg.render) {
		msg.render(document.body);
	} else {
		document.body.dispatchEvent(new CustomEvent('receive', { detail: msg }));
	}
};

const codec = getCodec();
const sendFilter = new MessageFilter(msgpack.encode, codec);
sendFilter.output = (msg) => { 
	if (w && w.readyState === 1) {
		w.send(msg);
	} else {
		sendQueue.push(msg);
	}
};

const receiveFilter = new MessageFilter(msgpack.decode, codec);
receiveFilter.output = receiveMessage;

const receiveReader = new FileReader();
receiveReader.onload = function receiveReaderOnLoad() {
	const newDataArray = new Uint8Array(this.result);

	receiveFilter.input(newDataArray);
};

document.addEventListener('DOMContentLoaded', function onDOMContentLoaded(e) {
	document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

	document.body.addEventListener('send', e => {
		sendFilter.input(e.detail);
	});
});


// push initial request
sendFilter.input(new GetScreenRequest('Register'));


const connectWebsocket = () => {
	w=new WebSocket('ws://' + location.host);

	w.onopen=(e) => {
		for(const msg of sendQueue) {
			w.send(msg);
		}

		// clear queue
		sendQueue.splice(0);
	};

	w.onerror=(e) => {
		console.error('Websocket error:', e);
	};

	w.onmessage=(e) => {
		receiveReader.readAsArrayBuffer(e.data);
	};

	w.onclose=(e) => {
		console.log('Closed, trying to reconnect ...');
		setTimeout(connectWebsocket, 1000);
	};
}

connectWebsocket();