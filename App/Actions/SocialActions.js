const FBSDK = require('react-native-fbsdk');
const {
    GraphRequest,
    GraphRequestManager,
    AccessToken
    } = FBSDK;
import { receive } from "../Constants/Actions"
const config = require("../../config");
var CurrentUserService = require('../Services/CurrentUserService');
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function loadFacebookUser() {
    AccessToken.getCurrentAccessToken().then(
        (token) => {
            var accessToken = token.accessToken.toString();

            var data = {
                grant_type: "convert_token",
                client_id: config.socialClient.id,
                client_secret: config.socialClient.secret,
                backend: "facebook",
                token: accessToken
            };

            fetch(config.api.socialLogin, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    alert(JSON.stringify(response))
                } else {
                    return response.json();
                }
            }).then((data) => {
                if (data) {
                    var token = data.access_token;
                    dispatch({
                        type: actions.receiveToken,
                        token: token
                    });
                    CurrentUserService.reloadCurrentUser(
                        token,
                        (currentUser) => {
                            dispatch({
                                type: actions.receiveCurrentUser,
                                currentUser: currentUser
                            })

                        },
                        (error) => {
                            alert(JSON.stringify(error));
                            dispatch({
                                type: actions.errorFetchCurrentUser
                            })
                        }
                    )
                }
            }).catch((error) => {
                //alert(error);
            });
        }
    );

    //const infoRequest = new GraphRequest(
    //    '/me',
    //    {
    //        parameters: {
    //            fields: {
    //                string: 'email,name,first_name,last_name,picture.width(200).height(200)'
    //            }
    //        }
    //    },
    //    (error, result) => {
    //        if (error) {
    //            alert(JSON.stringify(error))
    //        } else {
    //            alert(JSON.stringify(result));
    //
    //        }
    //    }
    //);
    //if (!user && !done) {
    //    new GraphRequestManager().addRequest(infoRequest).start();
    //}
}