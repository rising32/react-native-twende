var config = require('../config');
var ApiClient = require('../Services/ApiClient');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var TokenStore = require('../Stores/TokenStore');


module.exports = {

    _headers: function (token) {
        var token = token ? token : TokenStore.get();
        return {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
    },

    sendError: function (message, user, ride) {
        const data = {
            message: message,
            user: user,
            ride: ride
        };
        fetch(config.api.errorLog, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._headers(),
            timeout: 3000
        });
    }

};


