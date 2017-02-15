w=new WebSocket('ws://'+location.host);


const receiveMessage = (msg) => {
	if (msg.render) {
		msg.render(document.body);
	}
};


w.onopen=function wonopen(e){
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
