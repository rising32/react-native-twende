var config = require('../../config');
var TokenStore = require('../Stores/TokenStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CurrentUserService = require('../Services/CurrentUserService');
var ApiClient = require('../Services/ApiClient');
import {events} from "../Constants/Events";


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

                //this.eventEmitter.emit(events.loginFailed, {error: response.json()});
            }
            return response.json()
        }).then((data) => {
            var token = data.token;
            TokenStore.set(token, () => {
                CurrentUserService.getProfile(token);
            });
        }).catch((error) => {
            this.eventEmitter.emit(events.loginFailed, {error: error});
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
                throw new Error(response)
            }
            return viewModel.login({
                username: username,
                password: password
            })
        }).catch(function (error) {
            throw new Error(JSON.stringify(error))
        })
    }
};


module.exports = AuthService;
