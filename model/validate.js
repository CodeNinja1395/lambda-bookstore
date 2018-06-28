const Joi = require ('joi');

const schemaRequired = Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().regex(/^[a-zA-Z0-9\s]+$/).required(),
    author: Joi.string().regex(/^[a-zA-Z0-9\s]+$/).required(),
    added: Joi.string(),
    isDeleted: Joi.boolean()
});
const schemaOptional = Joi.object().keys({
    id: Joi.string(),
    title: Joi.string().regex(/^[a-zA-Z0-9\s]+$/),
    author: Joi.string().regex(/^[a-zA-Z0-9\s]+$/),
    added: Joi.string(),
    isDeleted: Joi.boolean()    
});

module.exports.validateReq = (object, callback) => {
    return Joi.validate(object, schemaRequired, callback);
};

module.exports.validateOpt = (object, callback) => {
    Joi.validate(object, schemaOptional, callback);
};



