import { Svg, Path, G, Defs, RadialGradient, Stop, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const RedditIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path
                fill="#FF4500"
                d="M10 0C4.477 0 0 4.477 0 10a9.969 9.969 0 0 0 2.929 7.071l-1.905 1.905A.6.6 0 0 0 1.448 20H10c5.523 0 10-4.477 10-10S15.523 0 10 0Z"
            />
            <Path fill="url(#b)" d="M15.67 11.995a2.335 2.335 0 1 0 0-4.67 2.335 2.335 0 0 0 0 4.67Z" />
            <Path fill="url(#c)" d="M4.331 11.995a2.335 2.335 0 1 0 0-4.67 2.335 2.335 0 0 0 0 4.67Z" />
            <Path
                fill="url(#d)"
                d="M10.006 16.666c3.682 0 6.667-2.239 6.667-5s-2.985-5-6.667-5-6.666 2.239-6.666 5 2.984 5 6.666 5Z"
            />
            <Path
                fill="#842123"
                d="M8.035 11.18c-.04.847-.602 1.155-1.256 1.155s-1.154-.434-1.115-1.28c.04-.848.602-1.409 1.256-1.409s1.154.687 1.115 1.534ZM14.347 11.054c.04.847-.46 1.28-1.115 1.28-.654 0-1.217-.306-1.255-1.154-.04-.847.46-1.534 1.115-1.534.654 0 1.217.56 1.255 1.408Z"
            />
            <Path
                fill="url(#e)"
                d="M11.977 11.254c.036.793.562 1.08 1.175 1.08.612 0 1.08-.43 1.043-1.223-.037-.793-.563-1.312-1.175-1.312-.613 0-1.08.662-1.043 1.455Z"
            />
            <Path
                fill="url(#f)"
                d="M8.034 11.254c-.036.793-.562 1.08-1.175 1.08-.612 0-1.08-.43-1.043-1.223.037-.793.563-1.312 1.175-1.312.613 0 1.08.662 1.043 1.455Z"
            />
            <Path
                fill="#BBCFDA"
                d="M10.005 12.9c-.827 0-1.62.04-2.352.113a.185.185 0 0 0-.156.254 2.719 2.719 0 0 0 2.508 1.637 2.72 2.72 0 0 0 2.507-1.637.185.185 0 0 0-.156-.254 23.958 23.958 0 0 0-2.351-.113Z"
            />
            <Path
                fill="#fff"
                d="M10.005 13.084c-.825 0-1.614.04-2.345.115a.188.188 0 0 0-.155.258 2.709 2.709 0 0 0 4.999 0 .188.188 0 0 0-.156-.258c-.73-.074-1.52-.115-2.344-.115Z"
            />
            <Path
                fill="url(#g)"
                d="M10.006 12.988c-.81 0-1.588.04-2.307.113a.185.185 0 0 0-.154.254 2.667 2.667 0 0 0 4.922 0 .185.185 0 0 0-.153-.254 23.065 23.065 0 0 0-2.308-.113Z"
            />
            <Path fill="url(#h)" d="M13.657 5.987a1.655 1.655 0 1 0 0-3.31 1.655 1.655 0 0 0 0 3.31Z" />
            <Path
                fill="url(#i)"
                d="M9.982 6.878c-.199 0-.359-.083-.359-.211a2.691 2.691 0 0 1 2.688-2.688.359.359 0 1 1 0 .717 1.974 1.974 0 0 0-1.97 1.97c0 .129-.162.212-.36.212Z"
            />
            <Path
                fill="#FF6101"
                d="M7.598 11.645c0 .307-.326.445-.728.445-.403 0-.73-.138-.73-.445s.327-.555.73-.555c.402 0 .728.248.728.555ZM13.87 11.645c0 .307-.327.445-.729.445-.402 0-.729-.138-.729-.445s.327-.555.729-.555c.402 0 .729.248.729.555Z"
            />
            <Path
                fill="#FFC49C"
                d="M7.373 10.814c.143 0 .259-.127.259-.283 0-.156-.116-.283-.26-.283-.143 0-.259.127-.259.283 0 .156.116.283.26.283ZM13.539 10.814c.143 0 .259-.127.259-.283 0-.156-.116-.283-.26-.283-.143 0-.259.127-.259.283 0 .156.116.283.26.283Z"
            />
        </G>
        <Defs>
            <RadialGradient
                id="b"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(4.6798 0 0 4.08238 15.704 8.402)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FEFFFF" />
                <Stop offset={0.4} stopColor="#FEFFFF" />
                <Stop offset={0.51} stopColor="#F9FCFC" />
                <Stop offset={0.62} stopColor="#EDF3F5" />
                <Stop offset={0.7} stopColor="#DEE9EC" />
                <Stop offset={0.72} stopColor="#D8E4E8" />
                <Stop offset={0.76} stopColor="#CCD8DF" />
                <Stop offset={0.8} stopColor="#C8D5DD" />
                <Stop offset={0.83} stopColor="#CCD6DE" />
                <Stop offset={0.85} stopColor="#D8DBE2" />
                <Stop offset={0.88} stopColor="#EDE3E9" />
                <Stop offset={0.9} stopColor="#FFEBEF" />
            </RadialGradient>
            <RadialGradient
                id="c"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(4.67981 0 0 4.08238 4.367 8.402)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FEFFFF" />
                <Stop offset={0.4} stopColor="#FEFFFF" />
                <Stop offset={0.51} stopColor="#F9FCFC" />
                <Stop offset={0.62} stopColor="#EDF3F5" />
                <Stop offset={0.7} stopColor="#DEE9EC" />
                <Stop offset={0.72} stopColor="#D8E4E8" />
                <Stop offset={0.76} stopColor="#CCD8DF" />
                <Stop offset={0.8} stopColor="#C8D5DD" />
                <Stop offset={0.83} stopColor="#CCD6DE" />
                <Stop offset={0.85} stopColor="#D8DBE2" />
                <Stop offset={0.88} stopColor="#EDE3E9" />
                <Stop offset={0.9} stopColor="#FFEBEF" />
            </RadialGradient>
            <RadialGradient
                id="d"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(14.1162 0 0 9.91134 10.184 7.748)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FEFFFF" />
                <Stop offset={0.4} stopColor="#FEFFFF" />
                <Stop offset={0.51} stopColor="#F9FCFC" />
                <Stop offset={0.62} stopColor="#EDF3F5" />
                <Stop offset={0.7} stopColor="#DEE9EC" />
                <Stop offset={0.72} stopColor="#D8E4E8" />
                <Stop offset={0.76} stopColor="#CCD8DF" />
                <Stop offset={0.8} stopColor="#C8D5DD" />
                <Stop offset={0.83} stopColor="#CCD6DE" />
                <Stop offset={0.85} stopColor="#D8DBE2" />
                <Stop offset={0.88} stopColor="#EDE3E9" />
                <Stop offset={0.9} stopColor="#FFEBEF" />
            </RadialGradient>
            <RadialGradient
                id="e"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(-1.17941 0 0 -1.73147 12.913 11.794)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F60" />
                <Stop offset={0.5} stopColor="#FF4500" />
                <Stop offset={0.7} stopColor="#FC4301" />
                <Stop offset={0.82} stopColor="#F43F07" />
                <Stop offset={0.92} stopColor="#E53812" />
                <Stop offset={1} stopColor="#D4301F" />
            </RadialGradient>
            <RadialGradient
                id="f"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(1.17941 0 0 1.73147 7.045 11.794)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#F60" />
                <Stop offset={0.5} stopColor="#FF4500" />
                <Stop offset={0.7} stopColor="#FC4301" />
                <Stop offset={0.82} stopColor="#F43F07" />
                <Stop offset={0.92} stopColor="#E53812" />
                <Stop offset={1} stopColor="#D4301F" />
            </RadialGradient>
            <RadialGradient
                id="g"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(4.15877 0 0 2.74301 10.03 15.227)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#172E35" />
                <Stop offset={0.29} stopColor="#0E1C21" />
                <Stop offset={0.73} stopColor="#030708" />
                <Stop offset={1} />
            </RadialGradient>
            <RadialGradient
                id="h"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="translate(13.696 2.665) scale(3.65058)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FEFFFF" />
                <Stop offset={0.4} stopColor="#FEFFFF" />
                <Stop offset={0.51} stopColor="#F9FCFC" />
                <Stop offset={0.62} stopColor="#EDF3F5" />
                <Stop offset={0.7} stopColor="#DEE9EC" />
                <Stop offset={0.72} stopColor="#D8E4E8" />
                <Stop offset={0.76} stopColor="#CCD8DF" />
                <Stop offset={0.8} stopColor="#C8D5DD" />
                <Stop offset={0.83} stopColor="#CCD6DE" />
                <Stop offset={0.85} stopColor="#D8DBE2" />
                <Stop offset={0.88} stopColor="#EDE3E9" />
                <Stop offset={0.9} stopColor="#FFEBEF" />
            </RadialGradient>
            <RadialGradient
                id="i"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="translate(12.175 6.645) scale(2.99221)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.48} stopColor="#7A9299" />
                <Stop offset={0.67} stopColor="#172E35" />
                <Stop offset={0.75} />
                <Stop offset={0.82} stopColor="#172E35" />
            </RadialGradient>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
