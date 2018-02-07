
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NativeModules, WebView, requireNativeComponent } from 'react-native';

const { RimWebViewManager } = NativeModules;

export default class RimWebView extends Component {
    constructor(props) {
        super(props);
        console.log('111111 RimWebView');
    }
    render() {
        return (
            <WebView
                {...this.props}
                nativeConfig={
                    {
                        component: CustomWebView,
                        props: {
                            enableUrlPrefixes: this.props.enableUrlPrefixes
                        },
                        viewManager: RimWebViewManager
                    }
                }
            />
        );
    }
}

RimWebView.propTypes = {
    ...WebView.propTypes,
    enableUrlPrefixes: PropTypes.arrayOf(PropTypes.object)
}

RimWebView.defaultProps = {
    enableUrlPrefixes: []
}

const CustomWebView = requireNativeComponent('RimWebView', RimWebView, WebView.extraNativeComponentConfig);