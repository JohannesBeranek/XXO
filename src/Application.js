const Game = require('./Game'),
	MessageFilter = require('./MessageFilter'),
	createCodec = require('./createCodec');

module.exports = class Application {
	constructor() {
		this.codec = createCodec();
	}

	connect(websocket) {
		const messageFilter = new MessageFilter(this.codec);
		messageFilter.output = (msg) => { this.msgHandler(msg); };
		websocket.on('message', messageFilter.input);

		// ctx.websocket.send('Hello Client!');
	}

	msgHandler(msg) {
		console.log(msg);
		console.log(this);
	}
}