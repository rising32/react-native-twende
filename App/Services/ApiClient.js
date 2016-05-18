var TokenStore = require('../Stores/TokenStore');

var ApiClient = {
  getHeaders: function() {
    var token = TokenStore.get();
    return {
      'Authorization': token ? 'JWT ' + token : '',
      'Content-Type': 'application/json'
    }
  }
};

module.exports = ApiClient;
