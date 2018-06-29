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

module.exports.validateReq = (object) => {
    return new Promise((resolve, reject) => {
        Joi.validate(object, schemaRequired, (err, valid) => {
            if (err) {
                reject(err);
            } else {
                resolve(valid);
            }
        });
    });
};
module.exports.validateOpt = (object) => {
    return new Promise((resolve, reject) => {
        Joi.validate(object, schemaOptional, (err, valid) => {
            if (err) {
                reject(err);
            } else {
                resolve(valid);
            }
        });
    });
};



// module.exports = (object, callback) => {
//     return {
//         validateReq: Joi.validate(object, schemaRequired, callback),
//         validateOpt: Joi.validate(object, schemaOptional, callback)
//     };
// };