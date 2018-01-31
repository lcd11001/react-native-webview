import React from 'react';
import { StyleSheet, Text, View, FlatList, Modal, WebView, StatusBar, Image, TouchableOpacity } from 'react-native';

import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

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
      modalVisible: false,
      modalUrl: '',
      serverStatus: 0, // -1: false, 0: not created, 1: success
      serverUrl: ''
    }

    // this.serverPath = RNFS.DocumentDirectoryPath + '/test';
    // path where files will be served from (index.html here)
    this.serverPath = RNFS.MainBundlePath + '/test';
    console.log('server path: ' + this.serverPath);

    this.server = new StaticServer(0, this.serverPath, {localOnly : true });
    this.server.start().then( (url) => {
      console.log('server started at url ' + url);

      this.setState({
        serverStatus: 1,
        serverUrl: url
      })
    });
  }

  componentWillMount() {
    this.delay(this.state.delaySplash);
  }

  render() {
    // https://docs.expo.io/versions/latest/sdk/app-loading.html
    if (this.state.isReady) {
      if (this.state.serverStatus == -1) {
        return (
          <View style={[styles.container, {justifyContent: 'center'}]}>
            <Text style={styles.header}>Fail to create local server</Text>
          </View>
        );
      }

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
                    //console.log('you clicked ' + rowData.item.title);
                    this.onModalOpen( rowData.item.path )
                  }}
                  serverUrl={this.state.serverUrl}
                  {...rowData.item}
                />
              );
            } }
          />

          {this.renderModal()}
        </View>
      );
    }

    return (
      <View style = {[styles.container, {backgroundColor: "#FEF9B0"}]}>
        <Image
          source={require("./data/splash/LifeShroom.png")}
          style={{width: "100%", height: "100%"}}
          resizeMode={"contain"}
        />
      </View>
    );
  }

  renderModal() {
    return (
        <Modal
            style={styles.modal}
            animationType="slide"
            visible={this.state.modalVisible}
            onRequestClose={this.onModalClose}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity
                    onPress={this.onModalClose}
                    style={styles.closeButton}
                >
                      <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <WebView
                    scalesPageToFit
                    javaScriptEnabled
                    //source={{uri: this.state.modalUrl}}
                    source={global.getHtml(this.state.serverUrl, this.state.modalUrl)}
                    onError={(event)=>{
                      console.log('webview error '); // JSON.stringify(event, nul, 2));
                    }}
                    renderError={()=>{
                      console.log('webview renderError ');
                    }}
                />
            </View>
        </Modal>
    );
  }

  onModalOpen(url) {
    console.log('onModalOpen');
    StatusBar.setHidden(true);
    this.setState({
        modalVisible: true,
        modalUrl: url
    });
  }

  onModalClose() {
    console.log('onModalClose');
    StatusBar.setHidden(false);
    this.setState({
        modalVisible: false
    })
  }

  delay(t) {
    // don't print log here
    //console.warn('start delay ' + t);
    let self = this;
    setTimeout(function(){
      //console.warn('finish delay ' + t);
      if (self.state.serverStatus != 0) {
        self.setState({
          isReady: true
        })
      } else {
        self.delay(t);
      }
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
    color: "#F44A3E",
    textAlign: 'center'
  },

  list: {
    width: "100%",
    //backgroundColor: "#FCE5BD"
  },

  modal: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },

  modalContent: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  closeText: {
    color: "yellow",
    backgroundColor: "red",
    fontSize: 20,
    padding: 10
  }
});
