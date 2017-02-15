w=new WebSocket('ws://'+location.host);


const receiveMessage = (msg) => {
	if (msg.render) {
		msg.render(document.body);
	} else {
		document.body.dispatchEvent(new CustomEvent('receive', { detail: msg }));
	}
};


w.onopen=function wonopen(e){
	document.body.addEventListener('send', e => {
		sendFilter.input(e.detail);
	});
	sendFilter.input(new GetScreenRequest('Register'));
};

const codec = getCodec();
const sendFilter = new MessageFilter(msgpack.encode, codec);
sendFilter.output = (msg) => { w.send(msg); };

const receiveFilter = new MessageFilter(msgpack.decode, codec);
receiveFilter.output = receiveMessage;

const receiveReader = new FileReader();
receiveReader.onload = function receiveReaderOnLoad() {
	const newDataArray = new Uint8Array(this.result);

	receiveFilter.input(newDataArray);
};

w.onmessage=(e) => {
	receiveReader.readAsArrayBuffer(e.data);
};
