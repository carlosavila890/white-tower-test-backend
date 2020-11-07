const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const getMongoDBConnection = require('../config/app_settings').getMongoDBConnection;

let _db;

const mongoConnect = (callback) => {
    const mongoDBConnection = getMongoDBConnection();
    MongoClient.connect(mongoDBConnection, {useUnifiedTopology: true}
    )
        .then(client => {
            console.log('Connected!');
            _db = client.db();

            //Creación de índice (Es idempotente, sino existe se crea)
            _db.collection('contacts').createIndex( { "$**": "text" } )

            callback();
        })
        .catch(err=> {
            console.log(err);
            throw err;
        }
    );
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;