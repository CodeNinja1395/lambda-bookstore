//const request = require('request');

class MyPromise {
    constructor(execute) {
        this._resolveQueue = [];
        this._errorHandler = null;
        this._error = null;
        this._value = null;
        this._state = 'pending';

        try {           
            execute(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject(e);
        }
    }

    _runRejectHandler() {
        if (this._errorHandler) {
            let rejection = this._errorHandler; 
            let returnValue = rejection.handler(this._error);

            rejection.promise._resolve(returnValue);
        }
    }
    _runResolveHandlers() {
        while(this._resolveQueue.length > 0) {
            var resolution = this._resolveQueue.shift();

            try {
                var returnValue = resolution.handler(this._value);
            } catch(e) {
                resolution.promise._reject(e);
            }

            if (returnValue && returnValue instanceof MyPromise) {
                returnValue.then(function (v) {
                    resolution.promise._resolve(v);
                }).catch(function (e) {
                    resolution.promise._reject(e);
                });
            } else {
                resolution.promise._resolve(returnValue);
            }
        }
    }
    _resolve(value) {
        if (this._state === 'pending') {
            this._value = value;
            this._state = 'resolved';
            
            this._runResolveHandlers(); 
        }
    }
    _reject(err) {   
        if (this._state === 'pending') {
            this._error = err;
            this._state = 'rejected';
            
            this._runRejectHandler();
            
            if (this._resolveQueue.length>0) {
                let resolution = this._resolveQueue.shift();
                resolution.promise._reject(this._error);
            }
        }
    }

    then(handler) {
        let newPromise = new MyPromise(() => {});

        this._resolveQueue.push({
            handler: handler,
            promise: newPromise
        });


        if (this._state === 'resolved') {
            this._runResolveHandlers();
        }

        if (this._state === 'rejected') {
            newPromise._reject(this._error);
        }
        return newPromise;
    }
    catch(err) {
        let newPromise = new MyPromise(() => {});

        this._errorHandler = {
            handler: err,
            promise: newPromise
        };

        if (this.state === 'rejected') {
            this._runRejectHandler();
        }

        //return newPromise;
    }
}

// let getCustom = new MyPromise((resolve, reject) => {
//     request('https://jsonplaceholder.typicode.com/posts/1', (err, data) => {      
//         if (err) {         
//             reject(err);
//         } 
        
//         resolve(data); 
//     });
// });


// getCustom
//     .then((e) => {
//         console.log(e.body); 
//         return new MyPromise((resolve, reject) => {
//             request('https://jsonplaceholder.typicode.com/posts/2', (err, data) => {
//                 if(err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });               
//     })
//     .then((res) => {       
//         console.log(res.body);        
//     })
//     .catch((err) => {
//         console.log('hello there');
        
//         console.log(err);        
//     });

module.exports = MyPromise;

