// for an updated version see https://github.com/jsdf/react-native-refreshable-listview

var React = require('react-native')
var {
    ListView,
    ActivityIndicatorIOS,
    StyleSheet,
    View,
    Text,
    ToastAndroid
    } = React

// must be less than ~50px due to ScrollView bug (event only fires once)
// https://github.com/facebook/react-native/pull/452
// TODO: expose as a prop when onScroll works properly
var PULLDOWN_DISTANCE = 10

var RefreshableListView = React.createClass({
    getInitialState() {
        return {
            reloading: false,
        }
    },
    handleScroll(e) {
        //ToastAndroid.show('dusss ' + e.nativeEvent.contentOffset.y , ToastAndroid.SHORT)
        if (e.nativeEvent.contentOffset.y < PULLDOWN_DISTANCE) {
            this.reloadData()
        }
        this.props.onScroll && this.props.onScroll(e)
    },
    reloadData() {
        if (this.willReload || this.state.reloading) return

        this.willReload = true
        Promise.all([
            this.props.loadData(),
            new Promise((resolve) => this.setState({reloading: true}, resolve)),
            new Promise((resolve) => setTimeout(resolve, 300)),
        ]).then(([data]) => {
            this.willReload = false
            this.setState({reloading: false})
        })
    },
    renderHeader() {
        if (this.state.reloading) {
            return (
                <View style={[styles.container, styles.wrapper]}>
                    <View style={[styles.container, styles.loading]}>
                        <Text>{this.props.refreshDescription}</Text>
                        <ActivityIndicatorIOS />
                    </View>
                </View>
            )
        } else {
            return null
        }
    },
    render() {
        return (
            <ListView
                {...this.props}
                onScroll={this.handleScroll}
                renderHeader={this.renderHeader}
            />
        )
    }
})

var styles = StyleSheet.create({
    wrapper: {
        height: 60,
        marginTop: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loading: {
        height: 60,
    },
});

RefreshableListView.DataSource = ListView.DataSource;

module.exports = RefreshableListView;