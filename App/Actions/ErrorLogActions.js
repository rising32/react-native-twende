'use strict';

const ErrorLogService = require('../Services/ErrorLogService');


export function sendError(token, message, data, ride) {
    ErrorLogService.sendError(token, message, data, ride);
}
