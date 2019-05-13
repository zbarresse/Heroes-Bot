module.exports = async ( client ) => {

	try {

		/** INIT CLIENT **/
		client.settings = require(client.folders.config+( process.argv[2] || 'settings' )+'.json');
		client.helpers = require(client.folders.utilities+'helpers.js');

		//client.links = require(client.folders.utilities+'links.json');

		/** INIT CLIENT CACHE */
		//const MongoClient = require('mongodb').MongoClient;
		//client.mongo = await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true } );
		//client.cache = await require(client.folders.utilities+'cache.js')( client.mongo );

		/** INIT SWGOH SERVICE
		const ApiSwgohHelp = require('api-swgoh-help');
		client.swgoh = new ApiSwgohHelp(client.settings.swapi);
		client.swapi = await require(client.folders.utilities+'swapi.js')( client.swgoh, client.cache, client.helpers );
		*/
	} catch(e) {
		console.error(e);
		throw e;
	}

}
