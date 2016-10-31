var TokenStore = require('../Stores/TokenStore');

var ApiClient = {
    _headers: function (token) {
        if (!token) {
            token = TokenStore.get();
        }
        return {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
    },

    get: function(url, resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: this._headers(token),
            timeout: 3000

        }).then((response) => {
            if (response.status !== 200) {
                reject({error: ''})
            }
            return response.json();
        }).then((profile) => {
            this.set(currentUser);
        }).catch((error) => {
            console.log('Error getting profile');
        });
    }
};

module.exports = ApiClient;
