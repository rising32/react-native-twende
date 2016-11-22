var config = require('../config');
var TokenStore = require('../Stores/TokenStore');
var DriverStore = require('../Stores/DriverStore');
var ApiClient = require('../Services/ApiClient');


var RideService = {
    _headers: function(){
        var token = TokenStore.get();
        return {
            'Authorization': 'Bearer ' + token,
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
        // Use primary key for driver
        if (ride.driver) ride.driver = ride.driver.id;
        if (!ride.customer_price) delete ride.customer_price;
        if (!ride.customer_rating) delete ride.customer_rating;
        if (!ride.driver_price) delete ride.driver_price;
        if (!ride.driver_rating) delete ride.driver_rating;
        return fetch(config.api.rides + ride.id + '/', {
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

    refresh: function (ride_id, resolve, reject) {
        return fetch(config.api.rides + ride_id, {
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
    },

    loadList: function (resolve, reject) {
        return fetch(config.api.rides + '?active=true', {
            method: 'GET',
            headers: this._headers(),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                reject(response);
            }
            return response.json();
        }).then((rides) => {
            return resolve(rides);
        }).catch((error) => {
            //reject(error);
        })
    }


};


module.exports = RideService;
