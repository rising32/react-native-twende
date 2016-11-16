var config = require('../config');
var ApiClient = require('../Services/ApiClient');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var TokenStore = require('../Stores/TokenStore');


var CurrentUserService = {

    _headers: function (token) {
        var token = token ? token : TokenStore.get();
        return {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
    },

    reloadCurrentUser: function (token, resolve, reject) {
        fetch(config.api.profile, {
            method: 'GET',
            headers: this._headers(token),
            timeout: 3000
        }).then((response) => {
            if (response.status !== 200) {
                return reject(response)
            }
            return response.json();
        }).then((currentUser) => {
            resolve(currentUser, token);
        }).catch((error) => {
            reject(error)
        });
    },

    updateCurrentUser: function (currentUser, resolve, reject) {
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
                reject(response);
            }
            return response.json();
        }).then((currentUser) => {
            resolve(currentUser);
        }).catch((error) => {
            reject(error);
        });
    },

    loginCurrentUser: function (credentials, resolve, reject) {
        fetch(config.api.token, {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then((response) => {
            if (response.status !== 200) {
                reject(response)
            } else {
                return response.json();
            }
        }).then((data) => {
            if (data) {
                var token = data.token;
                TokenStore.set(token);
                this.reloadCurrentUser(token, resolve, reject);
            }
        }).catch((error) => {
            reject(error);
        });
    }

};


module.exports = CurrentUserService;
