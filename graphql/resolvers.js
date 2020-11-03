const Contact = require('../models/contact');
const validator = require('validator')

function validateContactInput(contactInput) {
  const errors = [];

  if (!validator.isEmail(contactInput.email)) {
    errors.push({message: 'Email is invalid'});
  }

  if (validator.isEmpty(contactInput.name)) {
    errors.push({message: 'Name is required'});
  }

  if (validator.isEmpty(contactInput.address)) {
    errors.push({message: 'Address is required'});
  }

  if (validator.isEmpty(contactInput.email)) {
    errors.push({message: 'Email is required'});
  }

  if (errors.length > 0) {
    throwError(errors)
  }
}

function throwError(errors){
  const error = new Error('Invalid contact');
  error.data = errors;
  error.code = 422;//Unprocessable Entity
  throw error;
}

module.exports = {
  GetContactList: async function () {
    return await Contact.findAll();
  },

  GetContact: async function (args, req) {
    const contact = await Contact.findByContactId(args.contactId);

    if (!contact){
      const error = new Error('Contact not founded!');
      error.code = 404;
      throw error;
    }

    return contact;
  },

  CreateContact: async function ({ contactInput }, req) {
    validateContactInput(contactInput);

    const contactByEmail = await Contact.findByEmail(contactInput.email);
    if (contactByEmail)
      throwError([{message: 'Email in use by another contact'}]);

    const contactByName = await Contact.findByName(contactInput.name);
    if (contactByName)
      throwError([{message: 'Name in use by another contact'}]);

    const contact = new Contact(contactInput.name, contactInput.address, contactInput.phoneNumber, contactInput.email);
    const contactId = await contact.create();
    return {
      'contactId': contactId
    };
  },

  EditContact: async function ({ contactInput }, req) {
    validateContactInput(contactInput);

    const existingContact = await Contact.findByContactId(contactInput.contactId);
    if (existingContact) {
      const contactByEmail = await Contact.findByEmail(contactInput.email);
      if (contactByEmail && contactByEmail._id.toString() !== contactInput.contactId)
        throwError([{message: 'Email in use by another contact'}]);

      const contactByName = await Contact.findByName(contactInput.name);
      if (contactByName && contactByName._id.toString() !== contactInput.contactId)
        throwError([{message: 'Name in use by another contact'}]);

      const contact = new Contact(contactInput.name, contactInput.address, contactInput.phoneNumber, contactInput.email, contactInput.contactId);
      await contact.update();
    }
    else{
      throwError([{message: 'Contact not exists'}]);
    }

    return {
      'code': 200,
      'message': 'OK'
    };
  },

  DeleteContact: async function (args, req) {
    const existingContact = await Contact.findByContactId(args.contactId);
    if (existingContact) {
      const contact = new Contact(existingContact.name, existingContact.address, existingContact.phoneNumber, existingContact.email, existingContact._id);
      await contact.delete();
    }
    else{
      throwError([{message: 'Contact not exists'}]);
    }
    return {
      'code': 200,
      'message': 'OK'
    };
  }
}