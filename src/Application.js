const Game = require('./Game'),
	getCodec = require('./getCodec'),
	ClientContext = require('./ClientContext'),
	Player = require('./Player'),
	Loki = require('lokijs'),
	LokiFsStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter'),
	fs = require('fs');


module.exports = class Application {
	constructor(applicationRoot) {
		this._codec = getCodec();

		this._applicationRoot = applicationRoot;
	}

	async initAsync() {
		this.db = await new Promise((resolve, reject) => {
			const dbFilename = `${this._applicationRoot}/db/xx0.db`;
			const dbExists = fs.existsSync(dbFilename);

			const adapter = new LokiFsStructuredAdapter();

			const db = new Loki(dbFilename, {
				adapter: adapter,
				autoload: dbExists,
				autoloadCallback: () => {
					this.players = db.getCollection('players')
					|| db.addCollection('players', {
						unique: ['username']
					});

					resolve(db);
				},
				autosave: true,
				autosaveInterval: 10000,
			});

			if (!dbExists) {
				resolve(db);
			}
		});
	}

	get codec() {
		return this._codec;
	}

	connect(websocket) {
		const clientContext = new ClientContext(this, websocket);
	}

	async getPlayerByUsername(username) {
		const playerData = this.db.findOne({ username });

		const player = playerData ? new Player(playerData) : null;

		return player;
	}

	async createPlayer(username) {
		const player = Player.create(username);

		this.players.insert(player.getSerialized());

		return player;
	}

	async shutdown() {
		await new Promise((resolve, reject) => {
			this.db.close((e) => {
				resolve(e);
			});
		});
	}
}