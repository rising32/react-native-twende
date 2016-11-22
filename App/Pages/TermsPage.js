'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    ScrollView,
    View,
    Text,
    Navigator,
    StyleSheet
    } = ReactNative;

import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
import events from "../Constants/Events";
var NavIcon = require('../Components/NavIcon');
var Link = require('../Components/Link');
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';
import { loadFacebookUser }  from '../Actions/SocialActions';

var htmlStyle = StyleSheet.create({
    h1: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 5,
        marginTop: 5
    },
    h2: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        marginTop: 5
    },
    p: {
        marginBottom: 5,
        marginTop: 5
    },
    i: {
        fontStyle: 'italic'
    }
});


var LoginPage = React.createClass({

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigationBar={
            <Navigator.NavigationBar
                style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },

    renderScene: function (route, navigator) {

        return (
            <View style={{flex: 1}}>
                <ScrollView style={{marginTop: 50, padding:20, flex: 1}}>
                    <Text style={htmlStyle.h1}>Twende Terms of Service</Text>
                    <Text style={[htmlStyle.i, htmlStyle.p]}>Last updated: June 28th, 2016</Text>
                    <Text style={htmlStyle.h2}>Introduction</Text>
                    <Text style={htmlStyle.p}>
                        The goal of Twende is to be a Service that is fun, reliable and easy to use for everyone. In order to achieve this it is important to set out certain rules and conditions when using the Twende Services. In this document we describe what terms & conditions apply when you use the Twende app, so that you know what we expect from you and from the other users of Twende.
                    </Text>
                    <Text style={htmlStyle.h2}>Definitions</Text>
                    <Text style={htmlStyle.p}>
                        Twende is a social sharing platform where transport carriers (“Service Providers”) can offer and advertise their services to customers (“Customers”). The purpose of Twende is to improve mobility of persons and goods, to increase convenience for customers and business in the transportation of services and goods. The Twende platform will hereafter be referred to as the “Services”. Twende is incorporated as Twende BV at Tuinstraat 42, Utrecht, The Netherlands.
                    </Text>
                    <Text style={htmlStyle.p}>
                        Customers can be either individuals that make use of the Twende services or business that make use of the Services for transportation of persons or transportation of goods. Services providers and customers are collectively referred to as “Users” of the Services.
                        As the purpose of Twende is to improve mobility of persons and goods, to increase convenience for customers and business in the transportation of services and goods, we expect you to use Twende in line with these goals and refrain from any other (illegal) activity when using the services.
                    </Text>
                    <Text style={htmlStyle.h2}>User Account</Text>
                    <Text style={htmlStyle.p}>
                        You have to create an account to use the Services of Twende. If you are under the age of 18 you are not allowed to make an account and not allowed to use the Services. Furthermore, you are not allowed to let other persons use your Account. You may not assign or otherwise transfer your Account to any other person or entity. When using the Services you are not allowed to cause nuisance, annoyance, inconvenience, or property damage to any other party including the Service Provider.
                        As a User you may be asked to provide proof of identity to access or use the Services. Although the services are open to be used by anyone from 18 years onwards, we are allowed to ask for any information that we deem relevant in allowing the services to you.
                        When you create an Account, you agree that we may send you informational text (SMS) messages, facebook messages and e-mails as part of the normal business operation of your use of the Services. You may opt-out of receiving any of these messages from Twende at any time by sending an email to us.
                        We may create promotional codes, that have its own terms & conditions, at any time. The conduct arising out of the promotional codes will also be subject to the terms and conditions set forth in this terms of service document.
                    </Text>
                    <Text style={htmlStyle.h2}>Permission criteria</Text>
                    <Text style={htmlStyle.p}>
                        We have certain criteria that a Service Provider has to meet to be allowed on the platform. This includes having a valid driving license, third party insurance (and preferably all risk insurance), two helmets and a properly maintained motorbike and motorbike gear. Although we may help you in obtaining insurance, driving license, a self-owned boda boda motorcycle, two helmets, proper motorbike gear and a Smartphone we are not obligated to do so, and you shall be responsible for acquiring the aforementioned items yourself to be accepted on the Twende platform as a self-employed driver.
                        We strive to make the Twende services available to as many Service Providers and Customers as possible. Since we are in the process to define the criteria that Users of our platform should adhere to we might change the selection criteria in the future. You agree that at all time we are free to allow, reject, continue or discontinue the services to a Customer or a Service Provider, with or without explanation, related to a change in policy, admission criteria or any other reason.
                    </Text>
                    <Text style={htmlStyle.h2}>Zero Tolerance Policy</Text>
                    <Text style={htmlStyle.p}>
                        You agree that at all times you may be denied access to or be denied to make use of the Services, either temporarily or permanently (e.g. in case of evidence for falsified documents, misconduct, customer unfriendly behaviour, criminal behaviour, criminal record, etc.)
                        Furthermore Twende does not tolerate the use of alcohol or drugs by Service Providers when using the Twende services. Please abort the ride immediately if you believe that your driver may be under the influence of drugs or alcohol and notify us about this incident.
                    </Text>
                    <Text style={htmlStyle.h2}>Limitation of liability</Text>
                    <Text style={htmlStyle.p}>
                        Twende is a service provider and as such does not offer transportation services and does not act as a transportation carrier. Therefore it is not responsible for the conduct of its Users and, at all times, it is the sole responsibility of the Service Provider to decide whether or not to offer a ride to a Customer, and it the sole responsibility of the Customer to decide whether or not to accept a ride from any Service Provider. Also in case of logistic services (delivery of goods) it is the sole responsibility of Service Providers and Customers to decide whether to offer a ride and accept a ride.
                        As we want to act in line with the law of the country, it is prohibited to perform any illegal activity when using the Services. As Twende is a service provider, and not a transportation carrier, it cannot be held liable or responsible for illegal activities performed by its Users. Service Providers may use the Services in line with the offerings promoted by the app, including ridesharing services to Customers (individuals and businesses) and other logistic services (transportation of goods and items), excluding any illegal activities as described in the next paragraph.
                        You agree to comply with all applicable laws when using the Services, and you may only use the Services for lawful purposes (e.g., no transport of unlawful or hazardous materials). You agree that you will comply with all applicable laws when you make use of the Services, (e.g. no delivery of illegal items such as weapons, drugs) You agree to not perform any illegal activities when using the Services. Illegal activities are those activities that are set forth by Kenyan law to be illegal or those laws and rules that are set forth in any other jurisdiction where you make use of the Twende Services. We will work vividly to abstain the use of Twende for any illegal activity, however, Twende shall not be responsible for any illegal or criminal activity that is performed by Users when using the Services.
                        Twende wants to improve safety on the roads and incentivise riders to drive responsibly and safely. Also we promote the adherence to the Kenyan Traffic Act by our Service Providers and Customers. However, Twende cannot guarantee that the Services will be free from accidents or criminal activity. Therefore you accept the risk that comes with driving with any Service Provider, or by driving as a Service Provider, and you agree that Twende will not be responsible and will not be liable for any damages, direct, indirect, incidental and/or consequential, that may come about when making use of the Twende services. The damages described in this paragraph include, without limitation, physical damages, bodily injury, death and or emotional distress and discomfort or any material damages, robbery or theft. This includes any damages that may come about by being in contact, or communication with any Twende Users.
                        When there is an accident, complaint, dispute or conflict, involving you and a User of the Services, Twende is allowed to provide information to a claims processor or an insurer, including your contact information. This will only be done when this information or data is necessary to resolve the complaint, dispute or conflict.
                    </Text>
                    <Text style={htmlStyle.h2}>Amendments</Text>
                    <Text style={htmlStyle.p}>
                        We are free to amend these terms of service at any time. When we amend these terms of service we may update you about the renewed terms of service and / or you may be asked to accept them in order to continue using the Services. You agree that we are free to amend the terms and conditions at any time and that when you make use of the services you are aware of the most recent updated terms of service and that you agree with these terms of service.
                    </Text>
                    <Text style={htmlStyle.h2}>Governing Law</Text>
                    <Text style={htmlStyle.p}>
                        These Terms are construed in accordance with the laws of The Netherlands and shall be exclusively governed in accordance with the laws of The Netherlands. Parties shall first strive to handle the matter with mediation, after sixty days the matter might be taken to court. The place of both mediation and arbitration shall be in Utrecht, The Netherlands. If this is not possible, for any reason, the place of both mediation and arbitration shall be Amsterdam, The Netherlands. In discussion mediation might also take place somewhere else.
                    </Text>
                    <Text style={{height: 60}} />
                </ScrollView>
                <Link
                    action={() => this.props.navigator.pop()}
                    style={{padding: 10, justifyContent: 'center'}}
                    text={'Back'}
                    color={colors.action}
                />
            </View>
        );
    }
});

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return null
        //return (
        //    <NavIcon
        //        icon={"arrow-back"}
        //        action={() => {this.props.goBack()}}
        //    />
        //);
    },
    RightButton(route, navigator, index, navState) {
        return null
    },
    Title(route, navigator, index, navState) {
        return (
            <Text style={styles.nav_title}>
                TWENDE
            </Text>
        );
    }
};

module.exports = LoginPage;
