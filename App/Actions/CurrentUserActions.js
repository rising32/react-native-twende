'use strict';

var React = require('react-native');
var {
    AsyncStorage
    } = React;
var LocalKeyStore = require('../Stores/LocalKeyStore');
var TokenStore = require('../Stores/TokenStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CurrentUserService = require('../Services/CurrentUserService');

import dispatcher from "../Dispatcher";
import {sendError} from "../Actions/ErrorLogActions";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function reloadCurrentUser() {

    dispatch({
        type: actions.fetchCurrentUser
    });
    AsyncStorage.getItem('token').then((token) => {
        dispatch({
            type: actions.receiveToken,
            token: token
        });
        CurrentUserService.reloadCurrentUser(
            token,
            (currentUser) => {
                sendError("INFO", "Successfully reloaded user with token " + token);
                if (currentUser) {
                    dispatch({
                        type: actions.receiveCurrentUser,
                        currentUser: currentUser
                    })
                }
            },
            (error) => {
                sendError("ERROR", "Error reloading user with token " + token);
                dispatch({
                    type: actions.errorFetchCurrentUser
                })
            }
        );
    });
}

export function logoutCurrentUser() {
    dispatch({
        type: actions.logoutCurrentUser
    });
}

export function updateCurrentUser(currentUser) {
    dispatch({
        type: actions.updateCurrentUser,
        currentUser: currentUser
    });
    CurrentUserService.updateCurrentUser(
        currentUser,
        (currentUser) => {
            dispatch({
                type: actions.receiveCurrentUser,
                currentUser: currentUser
            })

        },
        (error) => {
            sendError("ERROR", "Error updating user", error);
            dispatch({
                type: actions.errorUpdatingCurrentUser
            })
        }
    );
}


export function loginCurrentUser(username, password) {
    dispatch({
        type: actions.loginCurrentUser,
        username: username
    });
    CurrentUserService.loginCurrentUser(
        {
            username: username,
            password: password
        },
        (currentUser, token) => {
            dispatch({
                type: actions.receiveToken,
                token: token
            });
            dispatch({
                type: actions.receiveCurrentUser,
                currentUser: currentUser
            })

        },
        (error) => {
            dispatch({
                type: actions.errorFetchCurrentUser
            })
        }
    );
}

export function setGcmToken(gcmToken) {

    dispatch({
        type: actions.setGcmToken,
        gcmToken: gcmToken
    });

}
