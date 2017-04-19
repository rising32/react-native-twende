var config = require('../config');
var ApiClient = require('../Services/ApiClient');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var TokenStore = require('../Stores/TokenStore');


module.exports = {

    _headers: function (token) {
        return {
            'Content-Type': 'application/json'
        };
    },

    sendError: function (level, message, data, user, ride) {
        const token = token ? token : TokenStore.get();
        const sendData = {
            level: level,
            token: token,
            data: data,
            message: message,
            user: user,
            ride: ride
        };
        fetch(config.api.errorLog, {
            method: 'POST',
            body: JSON.stringify(sendData),
            headers: this._headers(),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 201) {
                // Fail silently
                // alert(JSON.stringify(response));
            }
        })

    }

};


