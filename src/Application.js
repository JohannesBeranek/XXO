const Game = require('./Game'),
	MessageFilter = require('./MessageFilter'),
	createCodec = require('./createCodec'),
	msgpack = require('msgpack-lite');

module.exports = class Application {
	constructor() {
		this.codec = createCodec();
	}

	connect(websocket) {
		const messageFilter = new MessageFilter(msgpack.decode, this.codec);
		messageFilter.output = (msg) => { this.msgHandler(msg); };
		websocket.on('message', messageFilter.input);

		// ctx.websocket.send('Hello Client!');
	}

	msgHandler(msg) {
		console.log(msg);
	}
}