import React from 'react';
import { StyleSheet, Text, View, FlatList, Modal, WebView, StatusBar } from 'react-native';
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
      modalVisible: false,
      modalUrl: ''
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
                    //console.log('you clicked ' + rowData.item.title);
                    this.onModalOpen( rowData.item.path )
                  }}
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
      <AppLoading
        onError={() => {
            console.warn('App Loading Error');
            this.setState({isReady: true});
          }
        }
      />
    )
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
                <WebView
                    scalesPageToFit
                    javaScriptEnabled
                    //source={{uri: this.state.modalUrl}}
                    source={global.getHtml(this.state.modalUrl)}
                    onError={(event)=>{
                      console.log('webview error ' + JSON.stringify(event, nul, 2));
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
    backgroundColor: 'red',
  }
});
