var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CurrentUserService = require('../Services/CurrentUserService');
var ApiClient = require('../Services/ApiClient');


var AuthService = {

    login: function (username, password) {
        fetch(config.api.token, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((response) => {
            if (response.status !== 200) {
                CurrentUserStore.setLoginError();
            }
            return response.json()
        }).then((data) => {
            var token = data.token;
            TokenStore.set(token, () => {
                CurrentUserService.getProfile(token);
            });
        }).catch((error) => {
            console.log('Login error')
        });
    },

    signup: function (username, password) {
        return fetch(config.api.accounts, {
            method: 'POST',
            body: JSON.stringify(args),
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 3000

        }).then(function (response) {
            if (response.status != 201) {
                alert('Error: ' + JSON.stringify(response));
                throw new Error(response)
            }
            return viewModel.login({
                username: username,
                password: password
            })
        }).catch(function (error) {
            throw new Error(error.message)
        })
    }
};


module.exports = AuthService;
