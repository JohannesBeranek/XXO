const Game = require('./Game'),
	getCodec = require('./getCodec'),
	ClientContext = require('./ClientContext');

module.exports = class Application {
	constructor() {
		this._codec = getCodec();
	}

	get codec() {
		return this._codec;
	}

	connect(websocket) {
		const clientContext = new ClientContext(this, websocket);
	}

}