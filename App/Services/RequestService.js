var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var RequestStore = require('../Stores/RequestStore');
var ApiClient = require('../Services/ApiClient');


var RequestService = {

    _headers: function () {
        var token = TokenStore.get();
        return {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
    },

    getItems: function (pos) {
        var url = config.api.rides;
        return fetch(url, {
            method: 'GET',
            headers: this._headers(),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                console.log('Error ' + JSON.stringify(response));
                throw new Error(JSON.stringify(response));
            }
            return response.json();
        }).then((items) => {
            RequestStore.setItems(items);
            return drivers
        }).catch((error) => {
            console.log('ServerError ' + JSON.stringify(error));
        })
    }


};


module.exports = RequestService;
