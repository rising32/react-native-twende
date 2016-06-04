var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');


var CustomerService = {

    _headers: function(){
        var token = TokenStore.get();
        return {
            //'Authorization': 'JWT ' + token,
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
    },

    loadCustomerList: function (location, resolve, reject) {
        var url = config.api.rides;
        fetch(url, {
            method: 'GET',
            headers: this._headers(),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((items) => {
            return resolve(items);
        }).catch((error) => {
            reject(error);
        })
    }
};

module.exports = CustomerService;
