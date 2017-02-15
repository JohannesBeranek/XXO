module.exports = class PlayerRegisterRequestProcessor {
	constructor(clientContext) {
		this.clientContext = clientContext;
	}

	process(msg) {
		const username = msg.username;

		const exists = this.clientContext.app.getPlayerByUsername(username);

		console.log('Request for username', username);
	}
}
