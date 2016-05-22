var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var DriverStore = require('../Stores/DriverStore');
var ApiClient = require('../Services/ApiClient');


var DriverService = {

    _headers: function(){
        var token = TokenStore.get();
        return {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
    },

    loadDriverList: function (position, resolve, reject) {
        var url = config.api.drivers;
        if (position) {
            url += "?latitude=" + position.latitude + "&longitude=" + position.longitude;
        } else {
            return reject('Need position to fetch driver list');
        }
        fetch(url, {
            method: 'GET',
            headers: this._headers(),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((driverList) => {
            return resolve(driverList);
        }).catch((error) => {
            reject(error);
        })
    }

};


module.exports = DriverService;
