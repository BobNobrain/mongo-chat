// let MongoClient = require('mongodb').MongoClient;
//
// let url = 'mongodb://localhost:27015/chat';
// let collectionName = 'test';
//
// let db = null, collection = null;
//
// MongoClient.connect(url)
// 	.then(onConnect)
// 	.then(findByHash)
// 	.then(logThemAll)
// 	.catch(err => {
// 		console.error(err);
// 	})
// 	.then(() => {
// 		if (db !== null)
// 			db.close();
// 	})
// ;
//
// function onConnect(dbInstance)
// {
// 	console.log("Connected successfully!");
// 	db = dbInstance;
// 	collection = db.collection(collectionName);
// }
//
// function insertSomething()
// {
// 	return collection.insertMany(generateData());
// }
//
// function checkInsertion(result)
// {
// 	console.log('Insertion result: ');
// 	console.log(result);
// }
//
// function findByHash()
// {
// 	return collection.find({ hash: '1'}).toArray();
// }
//
// function logThemAll(data)
// {
// 	console.log('Found with hash of 1:');
// 	console.log(data);
// }
//
//
// function generateData(n = 20)
// {
// 	let result = [];
// 	for (let i = 0; i < n; i++)
// 	{
// 		let data = Math.round(Math.random() * 10000);
// 		result.push({
// 			hash: (data + '')[0],
// 			data
// 		});
// 	}
// 	return result;
// }
