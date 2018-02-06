import React, { Component } from 'react';
import {
    StyleSheet, TouchableOpacity, View, Text, Image, Platform
} from 'react-native';
import PropTypes from 'prop-types';

import global, { AppWidth, AppHeight } from '../common/global';

const AutoBind = require('auto-bind');



export default class CatalogItem extends Component {
    constructor(props) {
        super(props);
        AutoBind(this);
    }

    renderThumbnail(serverUrl, thumbnail) {
      if (Platform.OS == 'ios') {
        return (
          <View style={styles.thumbnailViewIOS}>
            <Image
                style={styles.thumbnailIOS}
                source={ global.getThumbnail(serverUrl, thumbnail) }
                defaultSource={ global.getDefaultThumbnail() }
            />
          </View>
        );
      }

      let imageComponent = null;

      return (
        <Image
            ref={(component) => imageComponent = component}
            source={ global.getThumbnail(serverUrl, thumbnail) }
            style={styles.thumbnail}
            onError={ (e) => {
                imageComponent.setNativeProps({ src: [{ uri: global.getDefaultThumbnailFromBase64() }] })
            }}
        />
      );
    }

    render() {
        const {
            title,
            description,
            thumbnail,
            orientation,
            type,
            path,
            onSelected,
            serverUrl
        } = this.props;

        return (
            <TouchableOpacity
                style={styles.container}
                onPress={onSelected}
            >
                <View style={styles.item}>
                    {
                        this.renderThumbnail(serverUrl, thumbnail)
                    }

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
    onSelected: PropTypes.func.isRequired,
    serverUrl: PropTypes.string
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
        //backgroundColor: "blue",
    },

    thumbnail: {
        padding: 0,
        flex: 1,
        //backgroundColor: "gray",
        width: "auto",
        height: "100%",
        resizeMode: "cover",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },

    thumbnailIOS: {
        flex: 1,
        //backgroundColor: "gray",
        width: "auto",
        height: "100%",
        resizeMode: "cover",
    },

    thumbnailViewIOS: {
      padding: 0,
      flex: 1,
      //backgroundColor: "gray",
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      overflow: "hidden",
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
        fontSize: global.getFontSize(20),
        color: "#020242"
    },

    description: {
        fontSize: global.getFontSize(15),
        color: "#382FFF"
    }
});
