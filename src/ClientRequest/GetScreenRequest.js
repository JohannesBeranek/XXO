const msgpack = require('msgpack-lite');

module.exports = class GetScreenRequest {
	constructor(screen) {
		this.screen = screen;
	}

	static pack(it) {
		const data = it.screen;
		return msgpack.encode(data);
	}

	static unpack(buffer) {
		const data = msgpack.decode(buffer);
		return new GetScreenRequest(data);
	}
}