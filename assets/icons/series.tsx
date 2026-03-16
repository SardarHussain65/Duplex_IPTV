import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SeriesIcon = (props: any) => (
    <Svg
        width={11}
        height={14}
        viewBox="0 0 11 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 6.75L0 13.5V0L10.5 6.75ZM6.945 6.75L1.9125 3.51V9.99L6.945 6.75Z"
            fill="#F4F5F6"
        />
    </Svg>
);
export default SeriesIcon;
