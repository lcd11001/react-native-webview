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
            onSelected
        } = this.props;

        let imageComponent = null;

        return (
            <TouchableOpacity 
                style={styles.container}
                onPress={onSelected}
            >
                <View style={styles.item}>
                    <Image 
                        ref={(component) => imageComponent = component}
                        source={ global.getThumbnail(thumbnail) }
                        defaultSource={ global.getDefaultThumbnail() }
                        style={styles.thumbnail}
                        onError={ (e) => {
                            if (Platform.OS !== 'ios')
                            {                                  
                                imageComponent.setNativeProps({ src: [{ uri: global.getDefaultThumbnailFromBase64() }] })
                            }
                        }}
                    />
                    <View style={styles.detail}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
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
    onSelected: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: 200,
        // backgroundColor: "yellow"
    },

    item: {
        flex: 1,
        flexDirection: "row",
        padding: 10,
        // backgroundColor: "blue"
    },

    thumbnail: {
        padding: 2,
        flex: 1,
        //backgroundColor: "gray",
        width: "auto",
        height: "100%",
        resizeMode: "cover",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },

    detail: {
        backgroundColor: "#78BEB3",
        flex: 2,
        flexDirection: "column",
        padding: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

    title: {
        fontSize: 20,
        color: "#020242"
    },

    description: {
        fontSize: 15,
        color: "#382FFF"
    }
});