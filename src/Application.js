const Game = require('./Game'),
	getCodec = require('./getCodec'),
	ClientContext = require('./ClientContext'),
	getPersistentCache = require('persistent-cache');


module.exports = class Application {
	constructor() {
		this._codec = getCodec();

		this.players = getPersistentCache({
			base: __dirname + '/db',
			name: 'players',
		});
	}

	get codec() {
		return this._codec;
	}

	connect(websocket) {
		const clientContext = new ClientContext(this, websocket);
	}

	async getPlayerByUsername(username) {

	}
}