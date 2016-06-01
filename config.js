//var apiUrl = 'http://192.168.43.171:7000/api/';
//var apiUrl = 'http://192.168.35.14:8000/api/';
//var apiUrl = 'http://192.168.3.102:7000/api/';
var apiUrl = 'http://twende.loekvan.gent/api/';
var mediaUrl = 'http://twende.loekvan.gent/';

exports.apiUrl = apiUrl;
exports.mediaUrl = mediaUrl;

exports.api = {
    rides: apiUrl + 'rides/',
    requensts: apiUrl + 'requensts/',
    drivers: apiUrl + 'drivers/',
    users: apiUrl + 'users/',
    token: apiUrl + 'token-auth/',
    accounts: apiUrl + 'accounts/',
    profile: apiUrl + 'accounts/me'
};

exports.camera_options = {
    title: 'Select avatar', // specify null or empty string to remove the title
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take picture', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: 'Choose from library', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'high', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 200, // photos only
    maxHeight: 200, // photos only
    aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.8, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
    }
};

// Time between two position polls (driver location)
exports.geoPositionMaxAge = 60;
