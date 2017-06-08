const sha256 = require("sha256");
class ManipulationMethods {

	reqLogin(username, password) {
		let id = Math.floor(Math.random() * 10000);
		this.send({
			"msg": "method",
			"method": "login",
			"params": [{
				"user": { "username": username },
				"password": {
					"digest": sha256(password),
					"algorithm": "sha-256"
				}
			}],
			"id": id.toString()
		});
		return id;
	}

}

module.exports = ManipulationMethods;