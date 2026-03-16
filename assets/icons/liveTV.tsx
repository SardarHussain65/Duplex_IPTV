import * as React from "react";
import Svg, { Path } from "react-native-svg";
const LiveTVIcon = (props: any) => (
    <Svg
        width={22}
        height={18}
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 0H20C21.1 0 22 0.9 22 2L21.99 14C21.99 15.1 21.1 16 20 16H15V18H7V16H2C0.9 16 0 15.1 0 14V2C0 0.9 0.9 0 2 0ZM2 14H20V2H2V14Z"
            fill="white"
        />
    </Svg>
);
export default LiveTVIcon;
