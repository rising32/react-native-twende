'use strict';

const ErrorLogService = require('../Services/ErrorLogService');


export function sendError(message, user, ride) {
    ErrorLogService.sendError(message, user, ride);
}
