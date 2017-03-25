'use strict';

var React = require('react-native');
var {
    StyleSheet
    } = React;


export var colors = {
    primary: '#ffda57', // brand book yellow
    action: '#1da69a', // brand book green
    secondary: '#273b95', // brand book blue
    disable: '#c2382b', // brand book red
    primary_dark: '#d1af42',
    action_secondary: '#555555', // dark grey
    action_disabled: '#E0E0E0', // light grey
    text: '#333333',
    text_important: '#1da69a', // kan vervangen worden met action
    title: '#555555',
    border: '#777777',
    nav_text: '#877a42',
    box: '#FFFFFF',
    login: '#f4f4f4',
    error: '#992200', // Dark Red
    box_dark: '#E0E0E0',
    button_normal: '#2BA59A',
    button_over: '#228BE1',
    button_clicked: '#1C79CE',
    button_text: '#FFFFFF'
};

export var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDCC60'
    },

    // Text
    baseText: {
        fontFamily: 'gothamrounded_medium',
     },

    text: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 16
    },

    text_important: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 15,
        color: colors.text_important
    },

    // Splash
    splash: {
        backgroundColor: colors.primary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    splash_title: {
        width: 220,
        height: 90
    },

    banner_splash: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
      width: 360,
      height: 170,
      bottom: 0
    },

    banner: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
      width: 360,
      height: 150,
      bottom: 0
    },

    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },


    // Spinner
    spinner: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderColor: '#999999',
        borderRadius: 10,
        borderWidth: 1,
        margin: 4,
        elevation: 10,
        backgroundColor: colors.login
    },

    spinner_text: {
        color: colors.secondary,
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        fontWeight: 'bold'
    },

    activity_indicator: { 
    flexDirection:'row',
    position: 'absolute',
    bottom: 260,
    elevation: 10
    },

    component2: {
    flex: 1,
    justifyContent:'center'
    },

    // Navigation
    nav_bar: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        elevation: 4,
    },
    nav_icon: {
        margin: 15
    },

    nav_title: {
        fontFamily: 'gothamrounded_book',
        color: colors.nav_text,
        fontSize: 17,
        marginTop: 18
    },

    instructions: {
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },

    // Page
    page: {
        marginTop: 56,
        justifyContent: 'space-around',
        flex: 1
    },

    scroll_page: {
        // justifyContent doesn't work with ScrollView
        marginTop: 56,
        flex: 1
    },
    page_full: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    heavy_text: {
        fontSize: 20,
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        color: colors.secondary
    },

    loginPage: {
        flex: 1,
        backgroundColor: colors.login,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    login_image: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Card
    card: {
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: colors.box
    },

    card_mid: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderRadius: 6,
        padding: 12,
        marginLeft: 40,
        marginRight: 40,
        margin: 0,
        backgroundColor: colors.box,
        alignItems: 'center'
    },

    card_mid_finalize: {
        height: 290,
        width: 235,
        justifyContent: 'space-between',
        borderRadius: 6,
        padding: 12,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: colors.box,
        alignItems: 'center'
    },

    card_mid_spacer: {
        backgroundColor: colors.box,
        padding: 20,
        marginTop: 35,
        height: 30,
        alignSelf: 'stretch'
     },

    card_mid_avatar: {
        marginTop: -80
    },

    card_mid_actions: {
        justifyContent: 'space-between',
        marginTop: 20,
        alignSelf: 'stretch',
        flexDirection: 'row'
    },

    card_input: {
        alignSelf: 'stretch',
        color: colors.action_secondary
    },

    // Sheet (persistent bottom sheet)
    sheet: {
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },

    sheetYellow: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'red'
    },

    sheet_content: {
        paddingTop: 20,
        alignItems: 'center'
    },

    sheet_dark: {
        paddingBottom: 10,
        paddingTop: 8,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.login
    },

    sheet_icon: {
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 6,
        elevation: 4
    },

    // Rider App

    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },

    // Sheet (persistent bottom sheet)
    sheet_rider: {
        paddingBottom: 20,
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },

    renderItemLeft: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        width: 120,
        marginTop: 30,
        marginLeft: 4
    },

    renderItemRight: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-start',
        width: 120,
        marginTop: 30,
        marginRight: 4
    },

    // Map
    map_container: {
        flex: 1,
        height: 250,
        backgroundColor: '#999999',
        borderWidth: 1,
        borderColor: colors.border
    },
    map: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    map_info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
        borderRadius: 2,
        elevation: 2,
        alignItems: 'center',
        backgroundColor: colors.box,
        padding: 8
    },

    map_title: {
        color: colors.title,
        fontSize: 16
    },

    map_text: {
        color: colors.secondary,
        fontWeight: '500',
        fontFamily: 'gothamrounded_medium',
        fontSize: 12
    },
    map_info_container: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    map_confirm: {
        borderRadius: 20,
        height: 40,
        width: 40,
        backgroundColor: colors.secondary,
    },

     marker: {
        width: 100,
        height: 100
    },

    // Lists

    list: {
        marginTop: 10
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 10,
        marginTop: 0,
        borderWidth: 0,
        borderColor: colors.border,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {width: 2, height: 2}
    },
    item_title: {
        fontFamily: 'gothamrounded_bold',
        color: colors.title,
        fontSize: 16
    },

    list_title: {
        fontFamily: 'gothamrounded_bold',
        color: colors.title,
        fontSize: 16
    },

    item_titlecentre: {
        color: colors.title,
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10
    },

    item_text: {
        color: colors.secondary,
        fontFamily: 'gothamrounded_medium',
    },
    item_image: {
        backgroundColor: '#999999',
        width: 80,
        height: 80
    },
    item_content: {
        flex: 1,
        flexDirection: 'row'

    },
    item_details: {
        padding: 8
    },

    item_action: {
        textAlign: 'right',
        fontFamily: 'gothamrounded_medium',
        color: colors.action,
        fontWeight: 'bold',
        marginRight: 8
    },

    // Forms

    text_input: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 16,
        height: 40
    },

    // Buttons

    primary_button: {
        marginTop: 10,
        marginRight: 4,
        marginLeft: 4,
        padding: 10,
        borderRadius: 4, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.button_normal,
        elevation: 3,
        flex: 1
    },

    primary_button_text: {
        fontFamily: 'gothamrounded_medium',
        color: colors.button_text
    },

    // Step bar

    step_bar: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        margin: 0
    },
    step: {
        width: 100,
        alignItems: 'center'
    },
    step_title: {
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        fontSize: 12
    },

    progress_sheet: {},

    // Avatar
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#ffffff'
    },

    menu_background: {
        width: 300,
        height: 200

    },
    menu_head: {
        height: 200
    },
    menu_title: {
        marginTop: -20,
        marginLeft: 10
    },
    menu_list: {
        backgroundColor: colors.action,
        padding: 8
    },
    menu_close: {
        marginTop: -190,
        marginLeft: 270
    },

    // StarRating
    starRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorOn: {
        color: '#FF4946'
    },
    colorOff: {
        color: '#999999'
    }
});
