'use strict'

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

var cid = "";
var old_cid = "";

if (process.argv.length >= 3) {
	cid = process.argv[2];
	if (process.argv.length >= 4) {
		old_cid = process.argv[3];
	}
}

if (cid === "") {
	console.error("CID argument is missing!");
	process.exit(1);
}

if (cid === old_cid) {
	console.error("Old and new CID's are the same:", cid);
	process.exit(1);
}

fs.readFile('pinata_auth.json', (err, data) => {
	if (err) throw err;
	var auth = JSON.parse(data);
	
	const pinata = pinataSDK(auth.PinataAPIKey, auth.PinataSecretAPIKey);

	// Quickly test that you can connect to the API with the following call:

	pinata.testAuthentication().then((result) => {
		// handle successful authentication here
		pinata.pinByHash(cid).then((result) => {
			// handle successful pin
			console.log(cid, "pinned to pinata");
			if (old_cid !== "") {
				pinata.unpin(old_cid).then((result) => {i
					console.log(cid, "pinned from pinata");
				}).catch((err) => {
					console.error(err);
					process.exit(1);
				});
			}
		}).catch((err) => {
			console.error(err);
			process.exit(1);
		});
	}).catch((err) => {
		console.error(err);
		process.exit(1);
	});
});

