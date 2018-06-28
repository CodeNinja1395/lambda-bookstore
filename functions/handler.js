'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
//const _ = require('underscore');
const { validateReq, validateOpt } = require('../model/validate');
const config = require('../config/config');

const dbClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

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

    dbClient.get(params, (err, data) => {    
        if (err) {
            const response = {
                statusCode: 404,
                body: JSON.stringify(err)
            };
            callback(null, response);
        }

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
    });
};

module.exports.getBooks = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: 'isDeleted = :is_deleted',
        ExpressionAttributeValues: {':is_deleted' : false}
    };
    dbClient.scan(params, (err, data) => {
        if (err) {
            const response = {
                statusCode: err.statusCode,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            };
            
            callback(null, response);
        }
        if(!data.Items) {
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
    validateReq(book, (err, valid) => {
        if(err) {
            const response = {
                statusCode: err.statusCode,
                body: JSON.stringify(err)
            };

            callback(null, response); 
        }
        const params = {
            Item: valid,
            TableName: process.env.DYNAMODB_TABLE    
        };

        dbClient.put(params, (err, data) => {
            if (err) {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };
                callback(null, response);
            } 
            const response = {
                statusCode: 200,
                body: JSON.stringify(data)
            };

            callback(null, response);        
        }); 
    });  
};

module.exports.editBook = (event, context, callback) => {
    const data = JSON.parse(event.body);
    validateOpt(data, (err, valid) => {
        if(err) {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    error: err
                })
            };

            callback(null, response); 
        }
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id
            },
            AttributeUpdates: {}
        };

        Object.keys(valid).forEach((prop) => {
            params.AttributeUpdates[prop] = {
                Action: 'PUT',  
                Value: valid[prop]
            };       
        });
        
        dbClient.update(params, (err, data) => {
            if(err) {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };

                callback(null, response);
            }
            const response = {
                statusCode: 200,
                body: JSON.stringify(data.Item)
            };

            callback(null, response);
        });     
    });
};

module.exports.deleteBook = (event, context, callback) => {
    const data = JSON.parse(event.body);  
    console.log(data);
    
    const params = {
        TableName : process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id
        },
        AttributeUpdates: {}
    };

    if (data.flush === config.flush && 
        event.headers.Authorization === config.authorization) {
        dbClient.delete(params, (err, data) => {
            if (err) {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };

                callback(null, response);
            }
            const response = {
                statusCode: 200,
                body: JSON.stringify(data)
            };

            callback(null, response);
        });
    } else {
        console.log(params);
        
        params.AttributeUpdates.isDeleted = {
            Action: 'PUT',
            Value: true
        };
        console.log(params);

        dbClient.update(params, (err, data) => {
            if (err) {
                const response = {
                    statusCode: err.statusCode,
                    body: JSON.stringify(err)
                };

                callback(null, response);
            }
            const response = {
                statusCode: 200,
                body: JSON.stringify(data)
            };

            callback(null, response);
        });   
    }
};
