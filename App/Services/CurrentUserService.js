var config = require('../../config');
var ApiClient = require('../Services/ApiClient');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var TokenStore = require('../Stores/TokenStore');


var CurrentUserService = {

    _headers: function (token) {
        var token = token ? token : TokenStore.get();
        return {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        };
    },

    getProfile: function (token) {
        fetch(config.api.profile, {
            method: 'GET',
            headers: this._headers(token),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                alert('Error getting profile: ' + JSON.stringify(error));
                CurrentUserStore.setLoginError();
            }
            return response.json();
        }).then((profile) => {
            CurrentUserStore.set(profile);
            return profile
        }).catch((error) => {
            console.log('Error getting profile: ' + JSON.stringify(error));
        });
    },
    updateUser: function (currentUser) {
        if (currentUser.picture) {
            currentUser.avatar = currentUser.picture;
        } else {
            delete currentUser.avatar;
        }
        fetch(config.api.profile, {
            method: 'PATCH',
            body: JSON.stringify(currentUser),
            headers: this._headers(),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 200) {
                alert('Error saving profile: ' + JSON.stringify(response));
                alert('Error saving profile: ' + JSON.stringify(response));
            }
            return response.json();
        }).then((profile) => {
            CurrentUserStore.set(profile);
            return profile
        }).catch((error) => {
            //alert('Error getting saving: ' + error);
        });
    }

};


module.exports = CurrentUserService;
