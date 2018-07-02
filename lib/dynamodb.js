const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

module.exports = {
    put: (params) => {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
