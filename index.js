let express = require('express');
let path = require('path');
let app = express();

// middleware
let logger = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let serveStatic = require('serve-static');

let addApi = require('./lib/api');

// app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
// app.use(app.router);
app.use(serveStatic(path.join(__dirname, 'static'), {'index': ['index.html', 'index.htm']}));

addApi(app);

// error handling
app.use(function(req, res, next){
    res.status(404);
    console.error('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
});
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
});

// Starting server
app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});

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
