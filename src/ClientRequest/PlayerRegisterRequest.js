const msgpack = require('msgpack-lite');

module.exports = class PlayerRegisterRequest {
	constructor(username) {
		this.username = username;
	}

	static pack(it) {
		const data = [it.username];
		return msgpack.encode(data);
	}

	static unpack(buffer) {
		const data = msgpack.decode(buffer);
		return new PlayerRegisterRequest(data[0]);
	}
}