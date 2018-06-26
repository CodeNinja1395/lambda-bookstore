'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const {validateReq, validateOpt} = require('../model/validate');

const dbClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

module.exports.homepage = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
             message: 'Go Serverless v1.0! Your function executed successfully!'   
        })
    };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.getBooks = (event, context, callback) => {
    const params = {
        TableName : 'books',
        Item: {
            id: 15
        }
    };
    const result = dbClient.scan(params, function(err, data) {
        if (err){
            callback(err, null);
        } else {
            callback(null, data);
        }
    });

}

module.exports.getBook = (event, context, callback) => {
  
}

module.exports.addBook = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const book = {
        id: uuid(),
        title: body.title,
        author: body.author,      
        added: Date.now(),
        isDeleted: false
    }    
    try {                
        const params = {
            Item: book,
            TableName: 'lambda-books-dev-BooksDynamoDbTable-18XSWIRSGOEA0'     
        }  
 
        dbClient.put(params, function(err, data) {
            if (err) {
                console.log(err);      
                callback(err, null);
            } else {
                console.log(data);           
                callback(null, data);
            }
            });    
    } catch (err) {
        callback(err, null);
        console.log(err);       
    }
}

module.exports.editBook = (event, context, callback) => {

}
module.exports.deleteBook = (event, context, callback) => {

}
