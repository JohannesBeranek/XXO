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

	static register(codec) {
		codec.addExtPacker(0x00, GetScreenRequest, GetScreenRequest.pack);
		codec.addExtUnpacker(0x00, GetScreenRequest.unpack);
	}
}