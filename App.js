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

import global from './src/common/global';
import CatalogItem from './src/components/CatalogItem';
import ModalWebView from './src/components/ModalWebView';

const AutoBind = require('auto-bind');

const AppBackgroundColor = '#FCE5BD';
var {width: AppWidth, height: AppHeight} = Dimensions.get('window');

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

      isShowingExitDialog: false,

      safeViewPaddingTop: 0,
      safeViewPaddingLeft: 0,
      safeViewPaddingRight: 0,
      safeViewPaddingBottom: 0,
      safeViewBackgroundColor: AppBackgroundColor
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
        <SafeAreaView 
          ref={(com) => this.safeAreaView = com}
          forceInset={{
            top: 'always', 
            left: 'always', 
            right: 'always', 
            bottom: 'always'
          }} 
          style={{flex: 1, backgroundColor: this.state.safeViewBackgroundColor}} 
        >
        <View 
          style={styles.container}
          /**
           * Invoked on mount and layout changes with
           *
           * {nativeEvent: { layout: {x, y, width, height}}}.
           */
          onLayout={ (event) => {
            let layout = event.nativeEvent.layout;
            var {width: AppWidth, height: AppHeight} = Dimensions.get('window');
            console.log('AppWidth ' + AppWidth + ' AppHeight ' + AppHeight);
            console.log('subview onLayout ' + JSON.stringify(layout, null, 2));
            let paddingTop = layout.y;
            let paddingLeft = layout.x;
            let paddingRight = AppWidth - layout.width - paddingLeft;
            let paddingBottom = AppHeight - layout.height - paddingTop;

            let padding = {
              safeViewPaddingTop : paddingTop,
              safeViewPaddingLeft: paddingLeft,
              safeViewPaddingRight: paddingRight,
              safeViewPaddingBottom: paddingBottom
            }
            console.log('padding ' + JSON.stringify(padding, null, 2));
            this.setState(padding);
          }}
        >
          
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
        </View>

        {this.renderModal()}

        </SafeAreaView>
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
    var W = AppWidth - this.state.safeViewPaddingLeft - this.state.safeViewPaddingRight;
    var H = AppHeight  - this.state.safeViewPaddingTop - this.state.safeViewPaddingBottom;
    var X = this.state.safeViewPaddingLeft;
    var Y = this.state.safeViewPaddingTop;

    var width = W;
    var height = H;
    var deg = '0deg';
    var x = X;
    var y = Y;

    if (orientation.indexOf('force-landscape') != -1) {
      width = H;
      height = W;

      x = this.state.safeViewPaddingTop;
      y = this.state.safeViewPaddingLeft;
    }
    else if (orientation.indexOf('landscape') != -1) {
      deg = '90deg';
      width = H;
      height = W;
      x = (width - W) / 2 + this.state.safeViewPaddingTop;
      y = -(height - H) / 2 - this.state.safeViewPaddingLeft;
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

    var W = AppWidth - this.state.safeViewPaddingLeft - this.state.safeViewPaddingRight;
    var H = AppHeight  - this.state.safeViewPaddingTop - this.state.safeViewPaddingBottom;

    var toEdge = style.snap;
    var snapStyle = {
      position: style.position || 'relative',
      width: style.width || W,
      height: style.height || H,
      left: 0,
      top: 0
    };

    switch (toEdge) {
      case 'top':
        snapStyle.top = 0;
        snapStyle.left = (W - snapStyle.width) / 2;
      break;

      case 'bottom':
        snapStyle.top = H - snapStyle.height;
        snapStyle.left = (W - snapStyle.width) / 2;
      break;

      case 'left':
        snapStyle.top = (H - snapStyle.height) / 2;
        snapStyle.left = 0;
      break;

      case 'right':
        snapStyle.top = (H - snapStyle.height) / 2;
        snapStyle.left = W - snapStyle.width;
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

    if (orientation.indexOf('force-landscape') != -1) {
      console.log('change device to landscape');
      Orientation.lockToLandscape();
    }

    // fixed: Android need time to hide status bar
    // fixed: iOS need time to rotate UIView
    let self = this;
    setTimeout(function(){
      let {deg, width, height, x, y} = self.rotateView(orientation);

      self.setState({
          modalVisible: true,
          modalUrl: url,
          modalRotateZ: deg,
          modalTranslateX: x,
          modalTranslateY: y,
          modalWidth: width,
          modalHeight: height,
          modalStyle: style,
          modalCanOpenUrl: item.type !== 'VBAN',
          safeViewBackgroundColor: item.type !== 'VBAN' ? 'black' : AppBackgroundColor
      });
    }, 500);
  }

  onModalClose() {
    console.log('onModalClose');

    this.setState({
        modalVisible: false,
        modalStyle: {},
        modalCanOpenUrl: false,
        safeViewBackgroundColor: AppBackgroundColor
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
        safeViewBackgroundColor: 'black'
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
    backgroundColor: AppBackgroundColor,
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
