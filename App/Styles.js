'use strict';

var React = require('react-native');
var {
    StyleSheet
    } = React;


export var colors = {
    primary: '#ffda57',
    splash: '#ffda57',
    primary_dark: '#d1af42',
    secondary: '#273b95',
    action: '#1da69a',
    action_secondary: '#555555',
    action_disabled: '#E0E0E0',
    text: '#333333',
    text_important: '#1da69a',
    title: '#555555',
    border: '#777777',
    nav_text: '#877a42',
    box: '#FFFFFF',
    error: '#992200',
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

    toggle: {
        marginTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'

    },

    // Text
    baseText: {
        fontFamily: 'gothamrounded_book',
     },

    text: {
        fontFamily: 'gothamrounded_book',
        fontSize: 16
    },

    text_important: {
        fontFamily: 'gothamrounded_book',
        fontSize: 16,
        color: colors.text_important
    },

    // Splash
    splash: {
        backgroundColor: colors.splash,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    splash_title: {
        fontSize: 28,
        fontFamily: 'gothamrounded_book'
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
        margin: 40,
        bottom: 200,
        elevation: 10,
        backgroundColor: 'white'
    },

    spinner_text: {
        color: '#999999',
        fontFamily: 'gothamrounded_book',
        fontSize: 18
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
        color: colors.nav_text,
        fontSize: 18,
        marginTop: 16
    },

    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },

    // Page
    page: {
        marginTop: 56,
        flex: 1
    },
    page_full: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    heavy_text: {
        fontSize: 20,
        fontFamily: 'gothamrounded_book',
        fontWeight: 'bold',
        color: colors.secondary
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
        padding: 10,
        paddingTop: 10,
        paddingBottom: 20,
        marginTop: 0,
        backgroundColor: colors.box,
        alignItems: 'center',
        alignSelf: 'stretch'
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
        paddingLeft: 40,
        paddingRight: 40
    },

    sheet_content: {
        paddingTop: 20
    },

    sheet_dark: {
        paddingBottom: 20,
        paddingTop: 10,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: colors.box_dark
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
        fontFamily: 'gothamrounded_book',
        color: colors.title,
        fontSize: 16
    },
    item_text: {
        color: colors.secondary,
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
        color: colors.action,
        fontWeight: 'bold',
        marginRight: 8
    },

    // Forms

    text_input: {
        fontSize: 16,
        height: 40
    },

    // Buttons

    primary_button: {
        marginTop: 10,
        marginRight: 4,
        marginLeft: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.button_normal,
        elevation: 3,
        flex: 1

    },
    primary_button_text: {
        color: colors.button_text,
        fontWeight: 'bold'
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
});
