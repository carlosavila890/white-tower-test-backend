const Contact = require('../models/contact');
const validateContactInput = require('../validations/contact_validations').validateContactInput;
const throwError = require('../validations/contact_validations').throwError;

module.exports = {
  GetContactList: async function (args, req) {
    return await Contact.findAll(args.page, args.pageSize, args.search, args.sortBy, args.sortDirection);
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