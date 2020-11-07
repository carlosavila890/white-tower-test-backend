'use strict';

const fs = require('fs');

const getJsonConfig = () => {
    let rawdata = fs.readFileSync('./config/app_settings.json');
    return JSON.parse(rawdata);
}

const getServerPort = () => {
    const config = getJsonConfig();
    return config.ServerPort;
}

const getGraphQLEndpoint = () => {
    const config = getJsonConfig();
    return config.GraphQLEndpoint;
}

const getMockEndpoint = () => {
    const config = getJsonConfig();
    return config.MockEndpoint;
}

const getContactsCollectionName = () => {
    const config = getJsonConfig();
    return config.ContactsCollectionName;
}

exports.getServerPort = getServerPort;
exports.getGraphQLEndpoint = getGraphQLEndpoint;
exports.getMockEndpoint = getMockEndpoint;
exports.getContactsCollectionName = getContactsCollectionName;