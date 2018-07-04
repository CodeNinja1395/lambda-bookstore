const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const MyPromise = require('./promiselib');

module.exports = {
    put: (params) => {
        return new MyPromise((resolve, reject) => {
            documentClient.put(params, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    update: (params) => {
        return new MyPromise((resolve, reject) => {
            documentClient.update(params, (err, res) => {
                if(err) {
                    reject(err);
                } else {                    
                    resolve(res);
                }
            });
        });
    },
    get: (params) => {
        return new MyPromise((resolve, reject) => {
            documentClient.get(params, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    remove: (params) => {
        return new MyPromise((resolve, reject) => {
            documentClient.delete(params, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    scan: (params) => {
        return new MyPromise((resolve, reject) => {
            documentClient.scan(params, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
};
