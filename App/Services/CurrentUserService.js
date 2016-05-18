var config = require('../../config');
var ApiClient = require('../Services/ApiClient');
var CurrentUserStore = require('../Stores/CurrentUserStore');


var CurrentUserService = {

    getProfile: function (token) {
        var headers = {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
        fetch(config.api.profile, {
            method: 'GET',
            headers: headers,
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                CurrentUserStore.setLoginError();
            }
            return response.json();
        }).then((profile) => {
            CurrentUserStore.set(profile);
            return profile
        }).catch((error) => {
            console.log('Error getting profile ' + error);
        });
    },
    updateProfile: function (change) {
        return fetchModule.fetch(config.api.profile, {
                method: 'PATCH',
                body: JSON.stringify(change),
                headers: config.getDefaultHeaders(),
                timeout: 3000

            })
            .then(function (response) {
                return response.json()
            })
            .catch(function (error) {
                throw error
            })
    }

};


module.exports = CurrentUserService;
