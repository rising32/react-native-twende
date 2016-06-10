


var RideRequestedPage = React.createClass({
    render: function () {
        var steps = [
            {in_progress: true, done: false, title: 'Ride requested'},
            {in_progress: false, done: false, title: 'Driver on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={this.props.currentUser.avatar}/>
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 20, marginRight: 20}}>
                            We're connecting you with {this.state.driver.name}
                        </Text>
                        <Avatar image={this.state.driver.avatar}/>
                    </View>

                    <View style={{padding: 30}}>
                        <Link style={{margin: 10}}
                              url={"tel: " + this.state.driver.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.action}
                              text={"CALL " + this.state.driver.name.toUpperCase()}
                        />
                        <Link style={{margin: 10}}
                              action={this.cancelRide}
                              icon={"clear"}
                              size={16}
                              iconSize={24}
                              color={colors.action_secondary}
                              text={"CANCEL RIDE"}
                        />
                    </View>
                </View>
            </View>
        )
    }
});
