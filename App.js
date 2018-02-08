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
  Dimensions,
  Linking,
  BackHandler,
  Alert
} from 'react-native';

import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

import Orientation from 'react-native-orientation';

import RimWebview from './_library/rim-webview';

import global, { AppWidth, AppHeight } from './src/common/global';
import CatalogItem from './src/components/CatalogItem';
import ModalWebView from './src/components/ModalWebView';

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
      modalCanOpenUrl: false,
      modalRotateZ: '0deg',
      modalTranslateX: 0,
      modalTranslateY: 0,
      modalWidth: '100%',
      modalHeight: '100%',
      modalStyle: {},

      serverStatus: 0, // -1: false, 0: not created, 1: success
      serverUrl: '',
      appOrientation: 'unknown',

      isShowingExitDialog: false
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

    BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    Orientation.lockToPortrait();
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
            <Text 
              style={styles.header}
              adjustsFontSizeToFit={false} // use global.getFontSize instead
              allowFontScaling={false}
              numberOfLines={1}
            >
              Fail to create local server
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.container}>
          <SafeAreaView forceInset={{ top: 'always' }} style={{backgroundColor: 'red'}} />
          <Text 
            style={styles.header}
            adjustsFontSizeToFit={false} // use global.getFontSize instead
            allowFontScaling={false}
            numberOfLines={1}
          >
            Testing local webview
          </Text>

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

  renderModal(item) {
    var modalSnapStyle = this.snapView(this.state.modalStyle);

    return (
      <ModalWebView
        modalVisible={this.state.modalVisible}
        modalUrl={global.getHtml(this.state.serverUrl, this.state.modalUrl)}
        
        modalViewStyle={[
          styles.modal, 
          styles.modalContent,
          modalSnapStyle
        ]}
        modalWebViewStyle={styles.webview}

        modalUrlPrefixesForDefaultIntent={['http://', 'https://']}
        modalEnableUrlPrefixes={[
          {'expand:': false},
          {'exit:': false}, 
          {'link:': false}
        ]}

        modalRotateZ={this.state.modalRotateZ}
        modalTranslateX={this.state.modalTranslateX}
        modalTranslateY={this.state.modalTranslateY}

        modalWidth={this.state.modalWidth}
        modalHeight={this.state.modalHeight}

        onModalMessage={(event) => {
          let data = event.nativeEvent.data;
          console.log('onModalMessage ' + data);
          
          if (data === 'exit:') {
            this.onModalClose();
          } else if (data === 'expand:') {
            this.onModalExpand();
          } else if (data.indexOf('link:') !== -1) {
            let url = data.replace('link:', '');
            this.onModalOpenUrl(url);
          }
        }}
      />
    );
  }

  rotateView(orientation) {
    var width = AppWidth;
    var height = AppHeight;
    var deg = '0deg';
    var x = 0;
    var y = 0;

    if (orientation.indexOf('force-landscape') != -1) {
      width = AppHeight;
      height = AppWidth;
    }
    else if (orientation.indexOf('landscape') != -1) {
      deg = '90deg';
      width = AppHeight;
      height = AppWidth;
      x = (width - AppWidth) / 2;
      y = -(height - AppHeight) / 2;
    }

    return ({
      deg: deg,
      width: width,
      height: height,
      x: x,
      y: y
    });
  }

  snapView(style) {
    if (!style.hasOwnProperty("snap"))
    {
      return style;
    }

    var toEdge = style.snap;
    var snapStyle = {
      position: style.position || 'relative',
      width: style.width || AppWidth,
      height: style.height || AppHeight,
      left: 0,
      top: 0
    };

    switch (toEdge) {
      case 'top':
        snapStyle.top = 0;
        snapStyle.left = (AppWidth - snapStyle.width) / 2;
      break;

      case 'bottom':
        snapStyle.top = AppHeight - snapStyle.height;
        snapStyle.left = (AppWidth - snapStyle.width) / 2;
      break;

      case 'left':
        snapStyle.top = (AppHeight - snapStyle.height) / 2;
        snapStyle.left = 0;
      break;

      case 'right':
        snapStyle.top = (AppHeight - snapStyle.height) / 2;
        snapStyle.left = AppWidth - snapStyle.width;
      break;

      default:
        console.warn('[TODO] snapView ' + snapEdge);
      break;
    }

    return snapStyle;
  }

  onModalOpen(item) {
    let url = item.path; 
    let orientation = item.orientation;
    let style = {};
    if (item.hasOwnProperty("style")) {
      style = item.style;
    }

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
        modalHeight: height,
        modalStyle: style,
        modalCanOpenUrl: item.type !== 'VBAN'
    });
  }

  onModalClose() {
    console.log('onModalClose');

    let {deg, width, height, x, y} = this.rotateView('portrait');

    this.setState({
        modalVisible: false,
        modalStyle: {},
        modalCanOpenUrl: false,

        modalRotateZ: deg,
        modalTranslateX: x,
        modalTranslateY: y,
        modalWidth: width,
        modalHeight: height,
    })

    StatusBar.setHidden(false);
    
    console.log('revert to ' + this.state.appOrientation)
    Orientation.lockToPortrait();
  }

  onModalExpand() {
    let {deg, width, height, x, y} = this.rotateView('landscape');
    this.setState({
        modalRotateZ: deg,
        modalTranslateX: x,
        modalTranslateY: y,
        modalWidth: width,
        modalHeight: height,
        modalStyle: {},
    });
  }

  onModalOpenUrl(url) {
    Linking.canOpenURL(url).then( (supported) => {
      if (supported) {
        if (this.state.modalCanOpenUrl) {
          Linking.openURL(url);
        } else {
          this.onModalExpand();
          // Fixed: VBAN auto open link
          // console.log('VBAN expanded');
          this.setState({
            modalCanOpenUrl: true
          });
        }
        
      } else {
        console.log("Don't know how to open URI " + url);
      }
    });
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

  handlerBackButton() {
    if (this.state.modalVisible) {
      this.setState({
        modalVisible: false
      })

      return true;
    }
    // console.log('handlerBackButton');
    if (!this.state.isShowingExitDialog) {
      this.showExitAppWarningDialog();
    }
    return true;
  }

  showExitAppWarningDialog() {
    // console.log('showExitAppWarningDialog');
    this.setState({
      isShowingExitDialog: true
    });

    Alert.alert(
      'Confirmation',
      'Would you like to exit the app?',
      [
        {
          text: 'Cancel', 
          onPress: () => { 
            // console.log('cancel clicked');
            this.setState({
              isShowingExitDialog: false
            });
          },
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => { 
            // console.log('OK clicked'); 
            this.server.kill();
            BackHandler.exitApp(); 
          }
        }
      ],
      {
        cancelable: false
      }
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    backgroundColor: '#FCE5BD',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  header: {
    fontSize: global.getFontSize(35),
    color: "#F44A3E",
    textAlign: 'center',
    textAlignVertical: "center",
    marginHorizontal: 2
  },

  list: {
    width: "100%",
    //backgroundColor: "#FCE5BD"
  },

  modal: {
    backgroundColor: 'transparent',
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
    fontSize: global.getFontSize(20),
    padding: 10
  },

  webview: {
    backgroundColor: 'transparent'
  }
});
