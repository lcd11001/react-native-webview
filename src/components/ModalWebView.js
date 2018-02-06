import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    WebView,
    StyleSheet
} from 'react-native';

import global, { AppWidth, AppHeight } from '../common/global';

import RimWebview from '../../_library/rim-webview';

export default class ModalWebView extends Component {
    constructor(props) {
        super(props);

        this.rimWebView = null;
        this.expandableView = null;

    }
    render() {
        if (this.props.modalVisible == false) {
            return null;
        }
      
        return (
            <View 
                ref={ (com) => this.expandableView = com }
                style={[
                    {
                        transform: [
                            {rotateZ: this.props.modalRotateZ},
                            {translateX: this.props.modalTranslateX}, 
                            {translateY: this.props.modalTranslateY}
                        ], 
                        width: this.props.modalWidth,
                        height: this.props.modalHeight
                    },
                    this.props.modalViewStyle
                ]}
            >
                    <RimWebview
                        ref={ (com) => this.rimWebView = com }
                        urlPrefixesForDefaultIntent={this.props.modalUrlPrefixesForDefaultIntent}
                        enableUrlPrefixes={this.props.modalEnableUrlPrefixes}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        style={[this.props.modalWebViewStyle]}
                        //source={{uri: this.state.modalUrl}}
                        source={this.props.modalUrl}
                        onError={(event) => {
                            console.log('webview error ' + event.url);
                        }}
                        onMessage={(event) => {
                            if (this.props.onModalMessage) {
                                this.props.onModalMessage(event);
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
        );
    }
}

ModalWebView.propTypes = {
    modalVisible: PropTypes.bool.isRequired,
    modalUrl: PropTypes.object.isRequired,
    modalCanOpenUrl: PropTypes.bool,
    modalRotateZ: PropTypes.string,
    modalTranslateX: PropTypes.number,
    modalTranslateY: PropTypes.number,
    modalWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    modalHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    modalUrlPrefixesForDefaultIntent: PropTypes.arrayOf(PropTypes.string),
    modalEnableUrlPrefixes: PropTypes.arrayOf(PropTypes.object),
    modalViewStyle: PropTypes.oneOfType([
        PropTypes.any,
        PropTypes.array
    ]),
    modalWebViewStyle: PropTypes.oneOfType([
        PropTypes.any,
        PropTypes.array
    ]),
    
    onModalMessage: PropTypes.func
}

ModalWebView.defaultProps = {
    modalVisible: false,
    modalUrl: global.getDefaultHtml(),
    modalCanOpenUrl: true,
    modalRotateZ: '0deg',
    modalTranslateX: 0,
    modalTranslateY: 0,
    modalWidth: AppWidth,
    modalHeight: AppHeight,
    modalUrlPrefixesForDefaultIntent: [],
    modalEnableUrlPrefixes: [],
    modalViewStyle: {},
    modalWebViewStyle: {},

    onModalMessage: null
}