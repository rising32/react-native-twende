var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var RideStore = require('../Stores/RideStore');
var ApiClient = require('../Services/ApiClient');


var RideService = {

    _headers: function(){
        var token = TokenStore.get();
        return {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
    },

    create: function (ride) {
        if (!ride.driver) {
            ride.driver = 0;
        }

        return fetch(config.api.rides, {
            method: 'POST',
            headers: this._headers(),
            body: JSON.stringify(ride),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 201) {
                alert('ServerError: ' + JSON.stringify(response));
            }
            return response.json();
        }).then((ride) => {
            RideStore.setCurrent(ride);
            return ride
        }).catch((error) => {
            alert('Error: ' + JSON.stringify(response));
            throw error
        })
    },

    getCurrent: function(){

    }
};


module.exports = RideService;
