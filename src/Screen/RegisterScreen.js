const Screen = require('./Screen'),
	msgpack = require('msgpack-lite'),
	PlayerRegisterRequest = require('../ClientRequest/PlayerRegisterRequest');

module.exports = class RegisterScreen extends Screen {
	constructor() {
		super('Register');
	}

	render(target) {
		super.render(target);

		if (!this.rootNode) {
			this.rootNode = document.createElement('div');
			this.rootNode.innerHTML = '\
	<form>\
	<label>Username <input name="username"></label>\
	<input type="submit" value="go">\
	</form>\
			';
			this.rootNode.querySelector('form').addEventListener('submit', e => this.onSubmit(e))
		}

		if (this.rootNode.parentNode !== target) {
			if (this.rootNode.parentNode) {
				this.rootNode.parentNode.removeEventListener('receive', this.receive);
			}

			target.appendChild(this.rootNode);
			target.addEventListener('receive', this.receive);
		}
	}

	receive(msg) {
		console.log('Received', msg);
	}

	onSubmit(e) {
		e.preventDefault();

		this.rootNode.parentNode.dispatchEvent(
			new CustomEvent('send', {
				detail: new PlayerRegisterRequest(this.rootNode.querySelector('[name=username]').value)
			})
		);
	}

	static pack(it) {
		return msgpack.encode(null);
	}

	static unpack(buffer) {
		return new RegisterScreen();
	}
}