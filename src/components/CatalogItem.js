import React, { Component } from 'react';
import {
    StyleSheet, TouchableOpacity, View, Text, Image, Platform
} from 'react-native';
import PropTypes from 'prop-types';

import global from '../common/global';

const AutoBind = require('auto-bind');



export default class CatalogItem extends Component {
    constructor(props) {
        super(props);
        AutoBind(this);
    }

    render() {
        const {
            title,
            description,
            thumbnail,
            orientation,
            type,
            path,
            onClicked
        } = this.props;

        let imageComponent = null;

        return (
            <TouchableOpacity 
                style={styles.container}
                onClicked={onClicked}
            >
                <View style={styles.item}>
                    <Image 
                        ref={(component) => imageComponent = component}
                        source={ {uri: global.getThumnail(thumbnail)} }
                        defaultSource={ global.getDefaultThumnail() }
                        style={styles.thumbnail}
                        onError={ (e) => {
                            if (Platform.OS !== 'ios')
                            {                                  
                                //imageComponent.setNativeProps({ src: [{ source: global.getDefaultThumnail() }] })
                                console.log('can not get thumnail ' + thumbnail);
                            }
                        }}
                    />
                    <View style={styles.detail}>
                        <Text>{title}</Text>
                        <Text>{description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

CatalogItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    orientation: PropTypes.string,
    type: PropTypes.string,
    path: PropTypes.string.isRequired,
    onClicked: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 100,
        height: 200,
        backgroundColor: "yellow"
    },

    item: {
        flex: 1,
        flexDirection: "row",
        padding: 10,
        backgroundColor: "blue"
    },

    thumbnail: {
        resizeMode: "cover",
        padding: 2
    },

    detail: {
        backgroundColor: "green",
        flex: 1,
        flexDirection: "column"
    }
});