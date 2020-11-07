const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb', {useUnifiedTopology: true}
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