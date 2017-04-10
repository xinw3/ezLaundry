import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
} from 'react-native';

export default class TouchableRowItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {rowData} = this.props;
    return (
      <View>
        <View style={styles.row}>

          <View style={styles.timeContainer}>
            <TouchableOpacity>
              <Text style={styles.text}>
                {rowData.slot}
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.separator} />
      </View>


    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
    // height: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  text: {
    flex: 1,
    color: '#929292',
    fontSize: 20,
  },
  timeContainer: {
    flex: 1,
    // margin: 10,
    justifyContent: 'flex-start',
  },
  untouchable: {
    backgroundColor: '#EEEEEE',
  },
});
