module.exports = class PlayerRegisterRequest {
	constructor(username, email) {
		this.username = username;
		this.email = email;
	}

	static pack(it) {
		const data = [it.username, it.email];
		return msgpack.encode(data);
	}

	static unpack(buffer) {
		const data = msgpack.decode(buffer);
		return new PlayerRegisterRequest(data[0], data[1]);
	}

	static register(codec) {
		codec.addExtPacker(0x00, PlayerRegisterRequest, PlayerRegisterRequest.pack);
		codec.addExtUnpacker(0x00, PlayerRegisterRequest.unpack);
	}
}