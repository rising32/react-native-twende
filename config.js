var apiUrl = 'https://twende.co.ke/api/';
var mediaUrl = 'https://twende.co.ke/';

exports.apiUrl = apiUrl;
exports.mediaUrl = mediaUrl;

exports.api = {
    socialLogin: apiUrl + 'auth/convert-token/',
    rides: apiUrl + 'rides/',
    location: apiUrl + 'location/',
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

// Time between two position polls (driver location) in seconds.
exports.geoPositionMaxAge = 60;
exports.geoPositionTimeOut = 60;


exports.socialClient = {
    id: "fYi1Hb7AOUpoby55Olp10V8Ory4O8yw858kgMfPF",
    secret: "s7XEVnQfjkxLeP5pWkCNUnROA5O7Sy2Y7PdZEDIxpEkQjCx8EyHkgGwRp5QsmGDo9o3GpqYoY9LMkxNesKDlXUVudePyoM1jzw2g4ohkX3c2NN8k209ZuLOuhZR8plwV",
};