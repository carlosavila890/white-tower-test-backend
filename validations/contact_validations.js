const validator = require('validator')

const throwError = (errors) => {
    const error = new Error("Invalid contact");
    error.data = errors;
    error.code = 422;//Unprocessable Entity
    throw error;
}

const validateContactInput = (contactInput) => {
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

    if (!validator.isLength(contactInput.email, { min: 1, max: 70 })) {
        errors.push({message: 'Email allows from 1 to 70 characters'});
    }

    if (!validator.isLength(contactInput.name, { min: 1, max: 100 })) {
        errors.push({message: 'Name allows from 1 to 100 characters'});
    }

    if (validator.isEmpty(contactInput.phoneNumber)) {
        errors.push({message: 'Phone number is required'});
    }

    if (errors.length > 0) {
        throwError(errors)
    }
}

exports.validateContactInput = validateContactInput;
exports.throwError = throwError;