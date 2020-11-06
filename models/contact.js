const getDb = require('../util/database').getDb;
const mongodb = require('mongodb')
var ObjectId = require('mongodb').ObjectId;
const collectionName = 'contacts';

module.exports = class Contact{
   constructor(name, address, phoneNumber, email, contactId) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this._id = contactId ? new mongodb.ObjectId(contactId) : null;
    }

    static findAll(page, pageSize, search) {
        var from = 0;
        if (page > 0) {
            from = page * pageSize;
        }

        var options = {
            "limit": pageSize,
            "skip": from,
            //"sort": [['field1','asc'], ['field2','desc']]
            //"sort": "name"
        }

        const db = getDb();
        const totalCount = db.collection(collectionName).find({}).count();

        return db.collection(collectionName)
            .find({}, options)
            .toArray()
            .then(contacts => {
                return {
                    items: contacts,
                    totalCount: totalCount
                };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    static findByContactId(contactId) {
        const db = getDb();
        return db.collection(collectionName)
            .find({ _id: ObjectId(contactId) })
            .next()
            .then(contact => {
                return contact;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    static findByEmail(email) {
        const db = getDb();
        return db.collection(collectionName)
            .find({ email: email })
            .next()
            .then(contact => {
                return contact;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    static findByName(name) {
        const db = getDb();
        return db.collection(collectionName)
            .find({ name: name })
            .next()
            .then(contact => {
                return contact;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    create() {
        const db = getDb();
        return db.collection(collectionName)
            .insertOne(this)
            .then(contact => {
                return contact.insertedId;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    update() {
        const db = getDb();
        return db.collection(collectionName)
            .updateOne({ _id: this._id },
            {
              $set: this,
              $currentDate: { lastModified: true }
            })
            .then(contact => {
                return contact;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    delete() {
        const db = getDb();
        return db.collection(collectionName)
            .deleteOne({ _id: this._id });
    }
}