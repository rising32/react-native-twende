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
import actions from "../Constants/Actions";


export function reloadCurrentUser() {

    dispatcher.dispatch({
        type: actions.fetchCurrentUser
    });
    AsyncStorage.getItem('token').then((token) => {
        CurrentUserService.reloadCurrentUser(
            token,
            (currentUser) => {
                dispatcher.dispatch({
                    type: actions.receiveCurrentUser,
                    currentUser: currentUser
                })

            },
            (error) => {
                dispatcher.dispatch({
                    type: actions.errorFetchCurrentUser
                })
            }
        );
    });
}

export function logoutCurrentUser() {
    console.log('logout action');
    dispatcher.dispatch({
        type: actions.logoutCurrentUser
    });
}

export function saveCurrentUser(currentUser) {
    dispatcher.dispatch({
        type: actions.updateCurrentUser,
        currentUser: currentUser
    });
    CurrentUserService.updateCurrentUser(
        currentUser,
        (currentUser) => {
            dispatcher.dispatch({
                type: actions.receiveCurrentUser,
                currentUser: currentUser
            })

        },
        (error) => {
            //dispatcher.dispatch({
            //    type: actions.errorUpdatingCurrentUser
            //})
        }
    );
}


export function loginCurrentUser(username, password) {
    dispatcher.dispatch({
        type: actions.loginCurrentUser,
        username: username
    });
    CurrentUserService.loginCurrentUser(
        {
            username: username,
            password: password
        },
        (currentUser) => {
            alert('Done');
            dispatcher.dispatch({
                type: actions.receiveCurrentUser,
                currentUser: currentUser
            })

        },
        (error) => {
            alert('wrong');
            dispatcher.dispatch({
                type: actions.errorFetchCurrentUser
            })
        }
    );
}