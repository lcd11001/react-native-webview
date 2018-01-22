import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';

const autoBind = require('auto-bind');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    
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
          <Text>Testing local webview</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
