module.exports = class GetScreenRequestProcessor {
	constructor(clientContext) {
		this.clientContext = clientContext;
	}

	process(msg) {
		const ScreenClass = require(`../Screen/${msg.screen}Screen.js`);

		const screen = new ScreenClass();

		this.clientContext.send(screen);
	}
}