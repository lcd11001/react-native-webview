export default class global {
    static getThumnail (file) {
        return "test/thumbnails/" + file
    };
    
    static getDefaultThumnail () {
        return "data/icon/Newsvine_512x512.png";
    }
    
    static getCatalogs () {
        var json = require('../config/config.json');
        return json.catalogs;
    }
}
