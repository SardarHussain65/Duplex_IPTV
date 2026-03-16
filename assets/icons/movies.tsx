import * as React from "react";
import Svg, { Path } from "react-native-svg";
const MoviesIcon = (props: any) => (
    <Svg
        width={20}
        height={16}
        viewBox="0 0 20 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 0H18C19.1 0 20 0.9 20 2V14C20 15.1 19.1 16 18 16H2C0.9 16 0 15.1 0 14L0.01 2C0.01 0.9 0.9 0 2 0L4 4H7L5 0H7L9 4H12L10 0H12L14 4H17L15 0ZM2 6V14H18V6H2Z"
            fill="white"
        />
    </Svg>
);
export default MoviesIcon;
