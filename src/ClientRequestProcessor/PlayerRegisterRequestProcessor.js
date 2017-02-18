module.exports = class PlayerRegisterRequestProcessor {
	constructor(clientContext) {
		this.clientContext = clientContext;
	}

	async process(msg) {
		const username = msg.username;

		let player;

		try {
			player = await this.clientContext.app.getPlayerByUsername(username);
		} catch (getPlayerException) {
			console.error('Exception on getPlayderByUsername:', getPlayerException);
		}

		if (!player) {
			try {
				player = await this.clientContext.app.createPlayer(username);
				console.log(`Created player with username ${username}.`);
			} catch (createPlayerException) {
				console.error('Exception on createPlayer:', createPlayerException);
			}
		}

		if (player) {
			this.clientContext.player = player;

			this.clientContext.send(player.getClientData());
		} else {
			console.error(`Failed processing PlayerRegisterRequest for username ${username}.`);

			// TODO: send error
		}

	}
}
