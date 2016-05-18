var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var DriverStore = require('../Stores/DriverStore');
var ApiClient = require('../Services/ApiClient');


var DriverService = {

    getList: function (pos) {
        var token = TokenStore.get();
        console.log('Using token ' + token);
        var headers = {
            //'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
        var url = config.api.drivers;
        if (pos) {
            url += "?latitude=" + pos.latitude + "&longitude=" + pos.longitude;
        }
        return fetch(url, {
            method: 'GET',
            headers: headers,
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                console.log('Error ' + JSON.stringify(response));
                throw new Error(JSON.stringify(response));
            }
            return response.json();
        }).then((drivers) => {
            DriverStore.setList(drivers);
            return drivers
        }).catch((error) => {
            console.log('ServerError ' + JSON.stringify(error));
        })
    }

};


module.exports = DriverService;
