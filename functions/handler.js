'use strict';
const uuid = require('uuid/v4');
const { validateReq, validateOpt } = require('../lib/validate');
const config = require('../config/config');

const docClient = require('../lib/dynamodb');

module.exports.homepage = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: config.homeMessage   
        })
    };

    callback(null, response);
};

module.exports.getBook = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    };

    docClient.get(params)
        .then((data) => {
            if(!data.Item || data.Item.isDeleted) {
                const response = {
                    statusCode: 404,
                    headers: { 
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify('can`t find book with this id')
                };
    
                callback(null, response);
            }  
                   
            const response = {
                statusCode: 200,
                body: JSON.stringify(data.Item)
            };
    
            callback(null, response);
        })
        .catch((err) => {
            const response = {
                statusCode: err.statusCode,
                body: JSON.stringify(err)
            };

            callback(null, response); 
        });
};

module.exports.getBooks = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: 'isDeleted = :is_deleted',
        ExpressionAttributeValues: {':is_deleted' : false}
    };

    docClient.scan(params)
        .then((data) => {
            if (!data.Items) {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify('Table is empty')
                }; 
    
                callback(null, response);
            }

            const response = {
                statusCode: 200,
                body: JSON.stringify(data.Items)
            };   
    
            callback(null, response);
        })
        .catch((err) => {
            const response = {
                statusCode: err.statusCode,
                body: JSON.stringify(err)
            };

            callback(null, response); 
        });
};

module.exports.addBook = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const book = {
        id: uuid(),
        title: body.title,
        author: body.author,      
        added: new Date(Date.now()).toString(),
        isDeleted: false
    };  

    validateReq(book)
        .then((valid) => {           
            const params = {
                Item: valid,
                TableName: process.env.DYNAMODB_TABLE    
            };
            return docClient.put(params);
        })
        .then((book) => {       
            const response = {
                statusCode: 200,
                body: JSON.stringify(book)
            };

            callback(null, response); 
        })
        .catch((err) => {
            const response = {
                statusCode: err.statusCode,
                body: JSON.stringify(err)
            };

            callback(null, response); 
        });
};

module.exports.editBook = (event, context, callback) => {
    const data = JSON.parse(event.body);

    validateOpt(data)
        .then((valid) => {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Key: {
                    id: event.pathParameters.id
                },
                AttributeUpdates: {}
            };
            if (valid.title) {
                params.AttributeUpdates.title = {
                    Action: 'PUT',  
                    Value: valid.title
                };
            }
            if (valid.author) {
                params.AttributeUpdates.author = {
                    Action: 'PUT',  
                    Value: valid.author
                };
            }
            return docClient.update(params);
        })
        .then((book) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(book)
            };

            callback(null, response); 
        })
        .catch((err) => {
            const response = {
                statusCode: err.statusCode,
                body: JSON.stringify(err)
            };

            callback(null, response); 
        });
};

module.exports.deleteBook = (event, context, callback) => {
    const data = JSON.parse(event.body);   
    const params = {
        TableName : process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id
        },
        AttributeUpdates: {}
    };

    if (data.flush === config.flush && 
        event.headers.Authorization === config.authorization) {
        docClient.remove(params)
            .then((data) =>{
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(data)
                };
    
                callback(null, response);
            })
            .catch((err) => {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };

                callback(null, response);
            });
    } else {
        params.AttributeUpdates.isDeleted = {
            Action: 'PUT',
            Value: true
        };

        docClient.update(params)
            .then((data) => {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(data)
                };
    
                callback(null, response);
            }) 
            .catch((err) => {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };

                callback(null, response);
            });
    }   
};

