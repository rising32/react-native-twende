'use strict';

const ErrorLogService = require('../Services/ErrorLogService');


export function sendError(token, message, data, user, ride) {
    ErrorLogService.sendError(token, message, data, user, ride);
}
