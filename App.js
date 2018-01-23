import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { AppLoading } from 'expo';

import global from './src/common/global';
import CatalogItem from './src/components/CatalogItem';

const AutoBind = require('auto-bind');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    AutoBind(this);
    
    this.state = {
      isReady: false,
      delaySplash: 2000, // miliseconds
    }
  }

  componentWillMount() {
    this.delay(this.state.delaySplash);
  }

  render() {
    // https://docs.expo.io/versions/latest/sdk/app-loading.html
    if (this.state.isReady) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Testing local webview</Text>
          <FlatList
            style={styles.list}
            data = {global.getCatalogs()}
            keyExtractor = { (item, index) => {
              return item.id
            }}
            renderItem={ (rowData) => {
              return (
                <CatalogItem
                  onSelected={()=>{
                    console.log('you clicked ' + rowData.item.title);
                  }}
                  {...rowData.item}
                />
              );
            } }
          />
        </View>
      );
    }
    
    return (
      <AppLoading
        onError={() => {
            console.warn('App Loading Error');
            this.setState({isReady: true});
          }
        }
      />
    )
  }

  delay(t) {
    // don't print log here
    //console.warn('start delay ' + t);
    let self = this;
    setTimeout(function(){
      //console.warn('finish delay ' + t);
      self.setState({
        isReady: true
      })
    }, t);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCE5BD',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  header: {
    fontSize: 40,
    color: "#F44A3E"
  },

  list: {
    width: "100%",
    //backgroundColor: "#FCE5BD"
  }
});
