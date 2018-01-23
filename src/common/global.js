export default class global {

}

global.getThumnail = (file) => {
    return "test/thumbnails/" + file
};

global.getDefaultThumnail = () => {
    return "data/icon/Newsvine_512x512.png";
}