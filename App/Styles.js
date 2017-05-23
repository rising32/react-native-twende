'use strict';

var React = require('react-native');
var {
    StyleSheet
    } = React;


export var colors = {
    primary: '#ffda57', // brand book yellow
    primarydark: '#ffd400', 
    action: '#1da69a', // brand book green
    secondary: '#273b95', // brand book blue
    disable: '#c2382b', // brand book red
    primary_dark: '#d1af42',
    action_secondary: '#555555', // dark grey
    action_disabled: '#E0E0E0', // light grey
    grey: '#606060', // medium grey
    text: '#333333',
    text_important: '#1da69a', // kan vervangen worden met action
    title: '#4c4c4c',
    border: '#777777',
    nav_text: '#877a42',
    box: '#FFFFFF',
    background: '#f4f4f4',
    error: '#992200', // Dark Red
    box_dark: '#E0E0E0',
    button_normal: '#2BA59A',
    button_over: '#228BE1',
    button_clicked: '#1C79CE',
    button_text: '#FFFFFF',
    star_rating: '#ffeb3b',
    white: '#ffffff',
    rating: '#ffe000'
};

export var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDCC60'
    },

    // Text
    text: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        textAlign: 'center',
        color: colors.grey
    },

    text_finalize: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        textAlign: 'center',
        color: colors.grey
    },
    
    text_ride: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 6,
        color: colors.grey
    },

    text_important: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 15,
        color: colors.text_important
    },

    text_card_mid: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        textAlign: 'center',
        color: colors.secondary
    },

    text_timer: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2,
        marginBottom: -30,
        color: colors.grey

    },

    countdown_timer: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 34,
        textAlign: 'right',
        color: colors.secondary,
        alignItems: 'flex-start',
        marginTop: -6,
        marginBottom: -40,
        backgroundColor: colors.white
    },

    countdown_timer_text: {
        fontFamily: 'gothamrounded_medium',
        fontSize: 18,
        textAlign: 'center',
        color: colors.secondary,
        marginBottom: -28,
        alignItems: 'flex-start',
        backgroundColor: colors.white
    },

    countdown_timer_view: {
        width: 60,
        height: 30
    },

    countdown_timer_container: {
        backgroundColor: colors.text_box,
        alignSelf: 'flex-end'
    },

    item_title: {
        textAlign: 'center',
        margin: 4,
        fontFamily: 'gothamrounded_bold',
        color: colors.title,
        fontSize: 16,
    },

    customer_title: {
        fontSize: 18,
        marginBottom: -4,
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        color: colors.title
    },

    customer_title_small: {
        fontSize: 18,
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        color: colors.title
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        width: 380,
        height: 120,
        marginTop: -40,
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
        backgroundColor: colors.background
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

    activity_indicator_pickup: { 
        flexDirection:'row',
        position: 'absolute',
        bottom: 160,
        elevation: 10
    },

    activity_indicator_container: {
        flex: 1,
        justifyContent:'center'
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

    // Page Elements
    page: {
        backgroundColor: colors.background,
        marginTop: 56,
        justifyContent: 'space-around',
        flex: 1
    },

    page_ride: {
        flex: 1,
        justifyContent: 'space-between'
    },


    page_finalize: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary
    },

    empty_view_riderhome: {
        backgroundColor: colors.background,
        flex: 0.8
    },

    empty_view_loginpage: {
        flex: 0.13,
        backgroundColor: colors.background,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        alignSelf: 'center'
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
        margin: 4,
        fontFamily: 'gothamrounded_medium',
        textAlign: 'center',
        color: colors.secondary
    },

    loginPage: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    login_image: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    sheet_top: {
        flexDirection: 'row', 
        alignSelf: 'stretch', 
        justifyContent: 'space-between', 
        marginTop: -24, 
        elevation: 5
    },

    timer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30
    },

    horizontal: {
        flexDirection: 'row',
    },

    avatar_centre: {
        elevation: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    // when parent view rendered 'column'
    avatar_centre_column: {
        alignItems: 'center',
        elevation: 20
    },

    line: {
        backgroundColor: colors.secondary,
        borderRadius: 5,
        elevation: 0.5,
        width: 110,
        height: 1.5,
        margin: 6
    },

    sheet_top_icon: {
        marginTop: -4,
        width: 29,
        height: 29
    },

    phone_icon: {
        width: 26,
        height: 26
    },

    cancel_icon: {
        width: 22,
        height: 22,
        marginTop: 2
    },

    motorcycle_icon: {
        width: 23,
        height: 23,
        marginTop: 2
    },

    // Cards

    card: {
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: colors.box
    },

    card_requesting: {
        position: 'absolute',
        marginLeft: 20,
        marginRight: 20,
        elevation: 2,
        height: 290,
        width: 235,
        justifyContent: 'space-between',
        borderRadius: 6,
        padding: 12,
        margin: 10,
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
        flex: 0.4,
        paddingTop: 20,
        justifyContent: 'center', 
        alignItems: 'center'
    },

    sheet_dark: {
        paddingBottom: 10,
        paddingTop: 8,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.background
    },

    sheet_icon: {
        flexDirection: 'row',
        marginRight: 10
    },

    sheet_icon_text: {
        fontFamily: 'gothamrounded_bold',
        alignSelf: 'center',
        fontSize: 12,
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 3,
        elevation: 2
    },

    sheet_icon_icon: {
        borderRadius: 15,
        width: 26,
        height: 26,
        alignItems: 'center',
        paddingTop: 3,
        marginBottom: 3,
        elevation: 2
    },

    // Rider App

    text_box: {
        elevation: 1,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 7,
        marginLeft: 30,
        marginRight: 30,
        marginTop: -10,
        alignItems: 'center',
        backgroundColor: colors.box
    },

    text_box_finalize: {
        elevation: 4,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 7,
        marginLeft: 26,
        marginRight: 26,
        marginBottom: 6,
        alignItems: 'center',
        backgroundColor: colors.box
    },


    toggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },

    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: -20
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
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        width: 120,
        marginTop: 26,
        marginLeft: 4
    },

    renderItemRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-start',
        width: 120,
        marginTop: 26,
        marginRight: 4
    },

    // Map

    map_container: {
        flex: 1,
        backgroundColor: '#999999',
        borderWidth: 0.55,
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

    map_marker_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center'
    },

    map_marker: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },


    // Lists

    list: {
        marginTop: 0
    },

    // Items

    telephone_button: {
        flexDirection: 'column', 
        marginTop: 10, 
        marginBottom: 10, 
        marginLeft: -10, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },



    item: {
        flexDirection: 'row',
        marginTop: 2,
        borderWidth: 0,
        borderColor: colors.border,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {width: 2, height: 2}
    },

    item_old: {
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

    list_title: {
        fontFamily: 'gothamrounded_bold',
        color: colors.grey,
        fontSize: 17
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
        width: 90,
        height: 90
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

    primary_button_customer_app: {
        flexDirection: 'row', 
        marginTop: 10,
        marginLeft: 18,
        marginRight: 18,
        marginBottom: 18
    },

    primary_button: {
        margin: 8,
        height: 50,
        bottom: 0,
        padding: 10,
        borderRadius: 4, 
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: colors.button_normal,
        elevation: 2
    },

    primary_button_finalize: {
        margin: 10,
        height: 40,
        bottom: 0,
        padding: 10,
        borderRadius: 4, 
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: colors.button_normal,
        elevation: 2
    },

    primary_button_flex: {
        flex: 1,
        margin: 14,
        height: 50,
        padding: 10,
        borderRadius: 4, 
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: colors.button_normal,
        elevation: 4
    },

    primary_buttons: {
        flexDirection: 'row',
        flex: 1,
        height: 40
    },

    primary_button_text: {
        flexDirection: 'row',
        textAlign: 'center',
        fontFamily: 'gothamrounded_medium',
        color: colors.button_text
    },

    login_button: {
        margin: 20,
        marginTop: 28,
        marginBottom: 28,
        height: 40,
        width: 260,
        bottom: 0,
        padding: 10,
        borderRadius: 4, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        elevation: 2
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

    avatar_rider_item: {
        width: 80,
        height: 80,
        borderRadius: 50,
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
    star_rating: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    starRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorOn: {
        color: colors.primary,
    },
    colorOff: {
        color: '#999999'
    }
});
