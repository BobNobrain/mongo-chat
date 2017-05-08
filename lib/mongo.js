const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27015/chat';

class DBConnector
{
	constructor()
	{
		this.db = null;
		this.opened = false;
		this.opening = true;
		this.promise = Promise.resolve(void 0);
	}

	connect()
	{
		this.promise = this.promise
			.then(() => {
				return MongoClient.connect(url);
			})
			.then((db) => {
				this.db = db;
				this.opened = true;
				this.opening = false;
			});
		this.opening = true;
		return this;
	}

	_connectIfNotYet()
	{
		if (!this.opening && !this.opened)
			this.connect();
	}

	wait()
	{
		return this.promise;
	}

	// the only method returning not this but this.promise
	close()
	{
		return this.promise = this.promise.then(() => {
			if (this.opened && this.db !== null)
			{
				this.opened = false;
				return this.db.close();
			}
		});
	}
}

class DBCollectionManager extends DBConnector
{
	constructor(colName)
	{
		super();
		this.collectionName = colName;
		this.collection = null;
	}

	connect()
	{
		super.connect();
		this.promise = this.promise.then(() => {
			this.collection = this.db.collection(this.collectionName);
		});
		return this;
	}

	withCollection(colName)
	{
		this.promise = this.promise.then(() => {
			this.collectionName = colName;
			if (this.opened)
			{
				this.collection = this.db.collection(this.collectionName);
			}
		});
		return this;
	}
}

// example of using:
// new DBWriter('users').write(currentUser).writeMany(currentUser.friends).close().then(_ => ...);
class DBWriter extends DBCollectionManager
{
	constructor(colName)
	{
		super(colName);
	}

	write(data)
	{
		this._connectIfNotYet();
		this.promise = this.promise.then(() => {
			return this.collection.insertOne(data);
		});
		return this;
	}

	writeMany(dataArr)
	{
		this._connectIfNotYet();
		if (!Array.isArray(dataArr))
			throw new Error('Illegal argument: writeMany should be given an array!');
		this.promise = this.promise.then(() => {
			return this.collection.insertMany(dataArr);
		});
		return this;
	}
}

class DBReader extends DBCollectionManager
{
	constructor(colName)
	{
		super(colName);
	}

	find(pattern)
	{
		this._connectIfNotYet();
		this.promise = this.promise.then(() => {
			return this.collection.find(pattern).toArray(); // TODO: use cursor instead
		});
		return this;
	}
}

module.exports = { DBWriter, DBReader };
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
// function getCollection(name)
// {
// 	return db.collection(name);
// }
//
//
// function onConnect(dbInstance)
// {
// 	console.log("Connected to MongoDB successfully!");
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
