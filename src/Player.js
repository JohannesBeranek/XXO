const EventEmitter = require('events').EventEmitter;

module.exports = class Player extends EventEmitter {
	constructor({ username }) {
		super();

		this.username = username;
	}

	static create(username) {
		return new Player({
			username,
			score: 0,
		});
	}

	getSerialized() {
		return {
			username: this.username,
		};
	}

	getClientData() {
		return {
			score: this.score,
		};
	}
}