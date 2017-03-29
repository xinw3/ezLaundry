'use strict';

import React, { Component } from 'react';

import { Text, TextInput, StyleSheet, Image, ListView, View, TouchableOpacity, Navigator } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import AccountScene from './AccountScene.js';
import Navbar from '../components/Navbar';

var routes = [
  {title: 'First Scene', index: 0},
  {title: 'Second Scene', index: 1},
];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var data = ['Account', 'Notification', 'Report to Maintenance', 'Send Us Feedback','Privacy Policy', 'Sign out'];

var SettingsScene = React.createClass({

  getInitialState: function() {
    const {navigator} = this.props;
    return {
      dataSource: ds.cloneWithRows(data)
    }
  },

  renderRow(rowData) {
    console.log("setting props", this.props);
    return (
      <View>
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={ () => {this.renderSettingScene(rowData)} }>
          <Text style={styles.text}>{rowData}</Text>
          <View style={styles.rightContainer}>
            <Icon style={styles.icon} name="ios-arrow-forward-outline" size={20} color="#4F8EF7" />
          </View>
        </TouchableOpacity>
        <View style={styles.separator}/>
      </View>
    )
  },

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    );
  },

  renderSettingScene(rowData) {
    const { navigator } = this.props;
    console.log(rowData);
    switch (rowData) {
      case 'Account':
        console.log("rowData", rowData);
        console.log("renderSettingScene", this.props);
        navigator.push({
          component: AccountScene,
          passProps: {
            username: this.props.username,
            password: this.props.password,
            address: this.props.address,
            city: this.props.city,
            property_name: this.props.property_name,
            title: rowData}
        });
        break;
    };

      // <View>
      // <Navigator
      //   initialRoute={{ title: 'Awesome Scene', index: 0 }}
      //   renderScene={(route, navigator) =>
      //     <Text>Hello {route.title}!</Text>
      //   }
      //   style={{padding: 100}}
      // />
      // </View>
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 20,
    paddingBottom: 25
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  text: {
    fontFamily: 'Helvetica',
    color: '#929292',
    fontSize: 20,
    marginLeft: 10,
    textAlign: 'center',
  },
  icon: {
    color: '#929292',
    marginRight: 10,
    top: 3
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
});
module.exports = SettingsScene;
