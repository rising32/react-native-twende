var DriverService = require('../Services/DriverService');
var GeoLocationStore = require('../Stores/GeoLocationStore');

var DriverActions = {
    loadList: function () {
        GeoLocationStore.refresh((position) => {
            DriverService.getList(position);
        });
    }
};

module.exports = DriverActions;
