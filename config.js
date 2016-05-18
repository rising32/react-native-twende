//var apiUrl = 'http://192.168.43.171:7000/api/';
//var apiUrl = 'http://192.168.35.29:7000/api/';
//var apiUrl = 'http://192.168.3.102:7000/api/';
var apiUrl = 'http://twende.loekvan.gent/api/';

exports.apiUrl = apiUrl;

exports.api = {
  rides: apiUrl + 'rides/',
  requensts: apiUrl + 'requensts/',
  drivers: apiUrl + 'drivers/',
  users: apiUrl + 'users/',
  token: apiUrl + 'token-auth/',
  accounts: apiUrl + 'accounts/',
  profile: apiUrl + 'accounts/me'
};
