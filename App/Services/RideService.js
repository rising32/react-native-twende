var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var DriverStore = require('../Stores/DriverStore');
var ApiClient = require('../Services/ApiClient');


var RideService = {
    _headers: function(){
        var token = TokenStore.get();
        return {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
    },

    create: function (ride, resolve, reject) {
        return fetch(config.api.rides, {
            method: 'POST',
            headers: this._headers(),
            body: JSON.stringify(ride),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 201) {
                reject(response);
            }
            return response.json();
        }).then((ride) => {
            return resolve(ride);
        }).catch((error) => {
            //reject(error);
        })
    },

    update: function (ride, resolve, reject) {
        return fetch(config.api.rides, {
            method: 'PATCH',
            headers: this._headers(),
            body: JSON.stringify(ride),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((ride) => {
            return resolve(ride);
        }).catch((error) => {
            //reject(error);
        })
    },

    refresh: function (ride, resolve, reject) {
        return fetch(config.api.rides + ride.id, {
            method: 'GET',
            headers: this._headers(),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((ride) => {
            return resolve(ride);
        }).catch((error) => {
            //reject(error);
        })
    }

};


module.exports = RideService;
