'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  ScrollView,
  Navigator,
  Alert
} from 'react-native';
import moment from 'moment-timezone';

import UTL from '../utilities';
import CountDown from '../components/CountDown';
import ListViewResConfirmContainer from '../containers/ListViewResConfirmContainer';
import API from '../api';

export default class ListViewStatusContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      WashingDS: this.props.WashingDS,
      DryerDS: this.props.DryerDS,
    }
  };

  // componentDidMount() {
  //   // console.log("ListViewStatusContainer props", this.props);
  //   // check the server if this person has a reservation
  //   this.callUTLfetchData("washing");
  //   this.callUTLfetchData("dryer");
  //
  //   // fetch machine data every 5 seconds
  //   //this.timer = setInterval(() => this.callUTLfetchData(), 5000);
  // };

  callUTLfetchData() {
    // console.log("callUTLfetchData enter", this.props);
    // console.log(this.state);
    UTL.fetchData(this.props.username, "washing", this.props.bottomTab, this.props.titleToPass).done((res) => {
      this.setState({
        WashingDS: this.state.WashingDS.cloneWithRows(res),
      });
    });
    UTL.fetchData(this.props.username, "dryer", this.props.bottomTab, this.props.titleToPass).done((res) => {
      this.setState({
        DryerDS: this.state.DryerDS.cloneWithRows(res),
      });
    });
  }


  render() {

    console.log('status props',this.props);
    // console.log('status state', this.state);
    var dataSource;
    if (this.props.selectedTab === "Washing") {
      dataSource = this.state.WashingDS._dataBlob == null ? this.props.WashingDS : this.state.WashingDS;
    }
    else if (this.props.selectedTab === "Dryer") {
      dataSource = this.state.DryerDS._dataBlob == null ? this.props.DryerDS : this.state.DryerDS;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.listContainer}>
          <ListView
            dataSource = {dataSource}
            renderRow = {this.renderRow.bind(this)} // auto bind
          />
        </ScrollView>
      </View>
    );
  };

  renderRow(rowData) {
    // console.log('rowData', rowData);
    var img = this.props.selectedTab === 'Washing' ? require('../img/status/Washing.png') : require('../img/status/Dryer.png');

    var raw_remainTime;
    //var end_time;

    if (rowData.end_time != null) {
      var end_time = moment(rowData.end_time).tz("America/New_York").format('hh:mm A');
      // Calculate the remain time in mmss
      raw_remainTime = moment(rowData.end_time).tz("America/New_York") - moment().tz("America/New_York");
      var remainTime = moment(raw_remainTime).format('mmss');
    } else {
      raw_remainTime = 0;
    }

    var displayTime = raw_remainTime;

    if (displayTime > 0) {
      // console.log("rowData display in use");
      // console.log("remainTime_num", remainTime_num);
      return (
          <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.centerContainer}>
                    <Text style={[styles.text, styles.machine_id]}>{rowData.display_id}</Text>
                </View>
                <Image style={styles.thumb} source={img} />
                <View style={styles.textContainer}>
                  <CountDown
                  time = {remainTime}   //TODO:
                  end_time = {rowData.end_time}
                  username = {rowData.username}
                  onCountDown = {
                    remainTime = this.handleCountDown.bind(this)
                  }/>
                  <Text style={[styles.text, styles.end_time]}>{end_time}</Text>
                </View>
            </View>
            <View style={styles.separator}/>
          </View>
      );
    } else {
      // console.log("rowData display available");
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.wrapper}
            onPress={() => Alert.alert(
              'Reservation',
              'Would you like to reserve this machine for 5 minutes?',
              [
                {text: 'Cancel'},
                {text: 'Confirm', onPress: (machine_id) => {
                  var machine_id = rowData.machine_id;
                  this.quickReserveConfirm(machine_id)} }
              ]
            )}>
            <View style={styles.container}>
              <View style={styles.rowContainer}>
                  <View style={styles.centerContainer}>
                      <Text style={[styles.text, styles.machine_id]}>{rowData.display_id}</Text>
                  </View>
                  <Image style={styles.thumb} source={img} />
                  <View style={[styles.textContainer, styles.centerContainer]}>
                    <Text style={[styles.text, styles.available]}>Available</Text>
                  </View>
              </View>
              <View style={styles.separator}/>
            </View>
          </TouchableOpacity>
        </View>
      );
    } // end of else
  } // end of renderRow

  /*
    Update the displayed remain time
  */
  handleCountDown(newRemainTime, end_time, username) {
    // TODO:
    // console.log("handleCountDown:\t" + end_time);
    const now = moment(new Date()).tz("America/New_York");
    if ( moment(now).isAfter(end_time) ) {
      // console.log("handleCountDown:\t timeout!");
      // TODO: Need to figure out whether it is n expired reservation or finished laundry
      if (username === this.props.username) { // It can be an expired reservation or finished laundry
        Alert.alert("Your reservation just expired!");
      }

      this.callUTLfetchData();
    } else {
      // console.log("handleCountDown:\t still waiting");
      return newRemainTime;
    }
  }; // handleCountDown


  /*
    Alert to confirm quickreservation
  */
  async quickReserveConfirm (machine_id) {
    // const fake_access_code = '1001';
    // console.log('Now in quickReserveConfirm');
    this.quickReserveSuccess(machine_id, function(res) {
      // console.log("quickReserveConfirm", JSON.stringify(res));
      if (!res) {
        // console.log("quickReserveConfirm", 'NULL');
        return;
      }
      // Raise another alert to confirm
      Alert.alert(
        'Reservation Code: ' + res,  // to be changed
        'You have reserved this machine successfully. Please note that this reservation will expire in 5 minutes.',
        [
          { text: 'OK' }
        ]
      );

    });
  }; // end of quickReserveConfirm

  // async quickReserveFinish(machine_id) {
  //   console.log("enter quickReserveFinish");
  //   var res = await API.quickReserve(this.props.username, machine_id);
  //
  //   if (res.message && res.message.toUpperCase() === 'SUCCESS') {
  //     console.log("quickReserveFinish Success");
  //     // Update the DS state - fetch the data again
  //     this.callUTLfetchData();
  //   } else {
  //     console.log("quickReserveFinish Fail");
  //     // Do nothing
  //     Alert.alert(res.message);
  //   }
  // }; // end of quickReserveSuccess

  async quickReserveSuccess (machine_id, callback) {
    // Call API to reserve this machine_id
    // console.log('Now in quickReserveSuccess');
    API.quickReserve(this.props.username, machine_id).then(function(res) {
      // console.log("quickReserveSuccess", res.access_code);
      if (res.message && res.message.toUpperCase() === 'SUCCESS') {
        // Update the DS state - fetch the data again
        // console.log("quick reserve success feftch data");
        var access_code = res.access_code;
        // this.callUTLfetchData();
        // console.log("access_code", access_code);
        return callback(access_code);
      } else {
        // Do nothing
        Alert.alert(res.message);
        return callback(null);
      }
    });
  };

}



var styles = StyleSheet.create({
  container: {
    flex: 1
  },

  scContainer: {
    backgroundColor: '#4AC3C0'
  },

  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff'
  },

  segmentedControl: {
    margin: 10,
    marginLeft: 30,
    marginRight: 30
  },

  text: {
    color: '#929292',
    fontSize: 15
  },
  thumb: {
    width: 60,
    height: 60
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  centerContainer: {
    justifyContent: 'center'
  },
  machine_id: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  remainTime: {
    fontSize: 30
  },
  end_time: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  available: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center'
  },
  wrapper: {
    backgroundColor: '#CCFFFF',
  }
});
