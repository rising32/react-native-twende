var RideService = require('../Services/RideService');
var GeoLocationStore = require('../Stores/GeoLocationStore');
var PushNotification = require('react-native-push-notification');


var NotifyActions = {
    local: function (title, message, ticker, payload, largeIcon, smallIcon) {
        PushNotification.localNotification({
            title: title,
            ticker: ticker ? ticker : title,
            largeIcon: largeIcon,
            smallIcon: smallIcon,
            message: message ? message : title,
            payload: payload ? payload : {}
        });
    }
};

module.exports = NotifyActions;



