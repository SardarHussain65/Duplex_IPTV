import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
const ParentalControlIcon = (props: any) => (
    <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G opacity={0.8} clipPath="url(#clip0_2307_17405)">
            <Path
                d="M10.0003 14.1667C10.4606 14.1667 10.8337 13.7936 10.8337 13.3333C10.8337 12.8731 10.4606 12.5 10.0003 12.5C9.54009 12.5 9.16699 12.8731 9.16699 13.3333C9.16699 13.7936 9.54009 14.1667 10.0003 14.1667Z"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.8333 8.3335H4.16667C3.24619 8.3335 2.5 9.07969 2.5 10.0002V16.6668C2.5 17.5873 3.24619 18.3335 4.16667 18.3335H15.8333C16.7538 18.3335 17.5 17.5873 17.5 16.6668V10.0002C17.5 9.07969 16.7538 8.3335 15.8333 8.3335Z"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.83301 8.33317V5.83317C5.83301 4.7281 6.27199 3.66829 7.0534 2.88689C7.8348 2.10549 8.89461 1.6665 9.99967 1.6665C11.1047 1.6665 12.1646 2.10549 12.946 2.88689C13.7274 3.66829 14.1663 4.7281 14.1663 5.83317V8.33317"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_2307_17405">
                <Rect width={20} height={20} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default ParentalControlIcon;
