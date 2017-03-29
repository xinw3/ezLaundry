'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ListView,
  SegmentedControlIOS,
  ScrollView,
  TouchableHighlight,
  Alert,
} from 'react-native';

import FloatLabelTextInput from 'react-native-floating-label-text-input';

import Navbar from '../components/Navbar';

export default class AccountScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      password: this.props.password,
      address: this.props.address,
      city: this.props.city,
      property_name: this.props.property_name
    }
  };

  render() {
    console.log('AccountScene', this.props);
    const { navigator } = this.props;
    const { username, password, passwordconfirm, address, city, property_name } = this.state;

    return (
      <View style={styles.container}>
        <Navbar title={this.props.title} leftBtn='Back' navigator={navigator} />
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            <View style={styles.inputContainer}>

              <TextInput
                style={styles.textInput}
                onChangeText={ (username) => {this.setState({username})}}
                placeholder={ username }
                autoCapitalize='none'
                placeholderTextColor='rgba(51,51,51,0.5)'
                autoCorrect={false}
                value={username} />

              <TextInput
                style={styles.textInput}
                onChangeText={ (password) => {this.setState({password})}}
                placeholder='password'
                autoCapitalize='none'
                secureTextEntry
                placeholderTextColor='rgba(51,51,51,0.5)'
                autoCorrect={false}
                value={password} />

              <TextInput
                style={styles.textInput}
                onChangeText={ (address) => {this.setState({address})}}
                placeholder='address'
                autoCapitalize='none'
                placeholderTextColor='rgba(51,51,51,0.5)'
                autoCorrect={false}
                value={address} />

              <TextInput
                style={styles.textInput}
                onChangeText={ (city) => {this.setState({city})}}
                placeholder='city'
                autoCapitalize='none'
                placeholderTextColor='rgba(51,51,51,0.5)'
                autoCorrect={false}
                value={city} />

              <TextInput
                style={styles.textInput}
                onChangeText={ (property_name) => {this.setState({property_name})}}
                placeholder='property name'
                autoCapitalize='none'
                placeholderTextColor='rgba(51,51,51,0.5)'
                autoCorrect={false}
                value={property_name} />

            </View>
          </View>
        </View>
      </View>
    );
  };

};

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  default: {
    height: 26,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 13,
    padding: 4,
  },
  inputContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  textInput: {
    alignSelf: 'center',
    height: 40,
    width: 250,
    marginTop: 26,
    fontSize: 17,
    padding: 10,
  },
  mainContainer: {
    justifyContent: 'center',
    marginTop: 50
  },
  labelContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    flex: 1,
  },
});
