'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;

import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class CustomerStore extends EventEmitter {

    constructor() {
        super();
        this._customers = {};

    };

    getList() {
        return this._customers;
    };

    setList(customers){
        this._customers = customers;
        this.emit(events.customerListLoaded, customers);
    };

    error() {
        this._customers = {};
        this.emit(events.errorLoadingCustomers);
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveCustomerList:
                this.setList(action.customerList);
                break;
            case actions.errorFetchCustomerList:
                this.error();
                break;
        }
    };
}


const customerStore = new CustomerStore;

dispatcher.register(customerStore.handleActions.bind(customerStore));

export default customerStore;