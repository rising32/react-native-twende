var RideService = require('../Services/RideService');
var GeoLocationStore = require('../Stores/GeoLocationStore');


var RideActions = {
    create: function (rideState) {
        RideService.create(rideState);
    }
};

module.exports = RideActions;
