const getDb = require('../util/database').getDb;
const fetch = require('node-fetch');
var http = require('http');
const Contact = require('../models/contact');
const getMockEndpoint = require('../config/app_settings').getMockEndpoint;
const getContactsCollectionName = require('../config/app_settings').getContactsCollectionName;
const getServerPort = require('../config/app_settings').getServerPort;

const initContacts = (totalContacts) => {
    const db = getDb();
    var collectionName = getContactsCollectionName();
    db.collection(collectionName).find({}).count()
    .then(totalCount => {
        //console.log(totalCount);
        if (totalCount === 0) {
            new Promise((resolve, reject) => {
                var mockEndpoint = getMockEndpoint();
                var serverPort = getServerPort();
                var url = 'http://localhost:' + serverPort + mockEndpoint + '?count=' + totalContacts;
                fetch(url)
                .then(response => response.json())
                .then(result => {
                    console.log("Generating contacts mock data");
                    //console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        const mockContact = result[i];
                        const contact = new Contact(mockContact.name, mockContact.address, mockContact.phoneNumber, mockContact.email);
                        contact.create();
                    }
                    console.log("Contacts mock data generated");
                    resolve();
                })
            });
        }
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

exports.initContacts = initContacts;