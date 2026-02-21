import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");
const roundedWidth = Math.round(width);
const roundedHeight = Math.round(height);

const guidelineBaseWidth = 960;
const guidelineBaseHeight = 540;

const xdHeight = (size: number) => {
    // const heightPercent = Math.round((size / guidelineBaseHeight) * 100);
    // return PixelRatio.roundToNearestPixel((roundedHeight * heightPercent) / 100);
        return PixelRatio.roundToNearestPixel((size / guidelineBaseHeight) * roundedHeight);

};

const xdWidth = (size: number) => {
    // const widthPercent = Math.round((size / guidelineBaseWidth) * 100);
    // return PixelRatio.roundToNearestPixel((roundedWidth * widthPercent) / 100);
        return PixelRatio.roundToNearestPixel((size / guidelineBaseWidth) * roundedWidth);

};

const scale = (size: number) => (roundedWidth / guidelineBaseWidth) * size;
const vs = (size: number) => (roundedHeight / guidelineBaseHeight) * size;
const ms = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const mvs = (size: number, factor = 0.5) => size + (vs(size) - size) * factor;

export {
    roundedHeight as height,
    ms,
    mvs,
    scale,
    vs,
    roundedWidth as width,
    xdHeight,
    xdWidth
};

