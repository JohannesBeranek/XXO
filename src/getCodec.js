const msgpack = require('msgpack-lite'),
	GetScreenRequest = require('./ClientRequest/GetScreenRequest'),
	PlayerRegisterRequest = require('./ClientRequest/PlayerRegisterRequest'),
	RegisterScreen = require('./Screen/RegisterScreen');

module.exports = function getCodec() {
	const codec = msgpack.createCodec();

	let counter = 0x00;

	for(c of [GetScreenRequest,PlayerRegisterRequest,RegisterScreen]) {
		codec.addExtPacker(counter, c, c.pack);
		codec.addExtUnpacker(counter, c.unpack);

		counter++;
	}

	return codec;
};