import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  WebView,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';

import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

import Orientation from 'react-native-orientation';

import RimWebview from './_library/rim-webview';

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
      modalRotateZ: '0deg',
      modalTranslateX: 0,
      modalTranslateY: 0,
      modalWidth: '100%',
      modalHeight: '100%',
      serverStatus: 0, // -1: false, 0: not created, 1: success
      serverUrl: '',
      appOrientation: 'unknown',
    }


    //  The absolute path to the main bundle directory
    console.log('MainBundlePath:' + RNFS.MainBundlePath) ;
    // The absolute path to the caches directory
    console.log('CachesDirectoryPath:' + RNFS.CachesDirectoryPath) ;
    // The absolute path to the document directory
    console.log('DocumentDirectoryPath:' + RNFS.DocumentDirectoryPath) ;
    // The absolute path to the temporary directory (iOS only)
    console.log('TemporaryDirectoryPath:' + RNFS.TemporaryDirectoryPath) ;
    // The absolute path to the external files, shared directory (android only)
    console.log('ExternalDirectoryPath:' + RNFS.ExternalDirectoryPath) ;
    // The absolute path to the external storage, shared directory (android only)
    console.log('ExternalStorageDirectoryPath:' + RNFS.ExternalStorageDirectoryPath) ;
    // The absolute path to the NSLibraryDirectory (iOS only)
    console.log('LibraryDirectoryPath:' + RNFS.LibraryDirectoryPath) ;
    // The absolute path to the pictures directory (android only)
    console.log('PicturesDirectoryPath:' + RNFS.PicturesDirectoryPath) ;

    // this.serverPath = RNFS.DocumentDirectoryPath + '/test';
    // path where files will be served from (index.html here)
    this.serverPath = (Platform.OS == 'ios' ? RNFS.MainBundlePath : RNFS.ExternalDirectoryPath) + '/test/';
    console.log('server path: ' + this.serverPath);

    this.server = new StaticServer(0, this.serverPath, {localOnly : true, keepAlive : true});
    this.server.start().then( (url) => {
      console.log('server started at url ' + url);

      this.setState({
        serverStatus: 1,
        serverUrl: url
      })
    });
  }

  componentWillMount() {
    const initOrientation = Orientation.getInitialOrientation();
    this.setState({
      appOrientation: initOrientation
    });

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
          <SafeAreaView forceInset={{ top: 'always' }} style={{backgroundColor: 'red'}} />
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
                    this.onModalOpen( rowData.item );
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
            transparent={true}
            animationType="slide"
            visible={this.state.modalVisible}
            onRequestClose={this.onModalClose}
        >
            <View 
              style={[
                styles.modalContent, 
                {transform: [
                  {rotateZ: this.state.modalRotateZ}, 
                  {translateX: this.state.modalTranslateX}, 
                  {translateY: this.state.modalTranslateY}
                ], 
                width: this.state.modalWidth, 
                height: this.state.modalHeight} 
              ]}
            >
                {/* <TouchableOpacity
                    onPress={this.onModalClose}
                    style={styles.closeButton}
                >
                      <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity> */}
                <RimWebview
                    urlPrefixesForDefaultIntent={['http://', 'https://']}
                    enableUrlPrefixes={[
                      {'exit:': true}, 
                      {'link:': 'remove'}, 
                      {'expand:': true}
                    ]}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    style={styles.webview}
                    //source={{uri: this.state.modalUrl}}
                    source={global.getHtml(this.state.serverUrl, this.state.modalUrl)}
                    onError={(event) => {
                      console.log('webview error ' + event.url);
                    }}
                    onMessage={(event) => {
                      let data = event.nativeEvent.data;
                      console.log('webview onMessage ' + data);
                      
                      if (data === 'exit:') {
                        this.onModalClose();
                      } else if (data === 'expand:') {
                        let {deg, width, height, x, y} = this.rotateView('landscape');
                        this.setState({
                            modalRotateZ: deg,
                            modalTranslateX: x,
                            modalTranslateY: y,
                            modalWidth: width,
                            modalHeight: height
                        });
                      }
                    }}
                    onShouldStartLoadWithRequest={(event) => {
                      // for Android: pls check
                      // https://github.com/cbrevik/webview-native-config-example
                      console.log('webview onShouldStartLoadWithRequest ' + event.url);
                      return true;
                    }}
                    onNavigationStateChange={(event) => {
                      console.log('webview onNavigationStateChange ' + event.url);
                    }}
                    onLoadStart={(event) => {
                      console.log('webview onLoadStart ' + event.url);
                    }}
                />
            </View>
        </Modal>
    );
  }

  rotateView(orientation) {
    var dimensions = Dimensions.get('window');

    var width = dimensions.width;
    var height = dimensions.height;
    var deg = '0deg';
    var x = 0;
    var y = 0;

    if (orientation.indexOf('force-landscape') != -1) {
      width = dimensions.height;
      height = dimensions.width;
    }
    else if (orientation.indexOf('landscape') != -1) {
      deg = '90deg';
      width = dimensions.height;
      height = dimensions.width;
      x = (width - dimensions.width) / 2;
      y = -(height - dimensions.height) / 2;
    }

    return ({
      deg: deg,
      width: width,
      height: height,
      x: x,
      y: y
    });
  }

  onModalOpen(item) {
    let url = item.path; 
    let orientation = item.orientation;

    console.log('onModalOpen ' + orientation);
    StatusBar.setHidden(true);

    let {deg, width, height, x, y} = this.rotateView(orientation);

    if (orientation.indexOf('force-landscape') != -1) {
      console.log('change device to landscape');
      Orientation.lockToLandscape();
    }

    this.setState({
        modalVisible: true,
        modalUrl: url,
        modalRotateZ: deg,
        modalTranslateX: x,
        modalTranslateY: y,
        modalWidth: width,
        modalHeight: height
    });
  }

  onModalClose() {
    console.log('onModalClose');
    this.setState({
        modalVisible: false
    })

    StatusBar.setHidden(false);
    
    console.log('revert to ' + this.state.appOrientation)
    Orientation.lockToPortrait();
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
    //backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },

  modalContent: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },

  closeText: {
    color: 'yellow',
    backgroundColor: 'red',
    fontSize: 20,
    padding: 10
  },

  webview: {
    backgroundColor: 'transparent'
  }
});
