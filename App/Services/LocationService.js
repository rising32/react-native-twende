var config = require('../../config');
var ApiClient = require('../Services/ApiClient');
var TokenStore = require('../Stores/TokenStore');


var LocationService = {

    _headers: function (token) {
        var token = token ? token : TokenStore.get();
        return {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
    },

    storeLocation: function (location, resolve, reject) {
        fetch(config.api.location, {
            method: 'POST',
            body: JSON.stringify({location: location}),
            headers: this._headers(),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((location) => {
            resolve(location);
        }).catch((error) => {
            reject(error);
        });
    }
};


module.exports = LocationService;
