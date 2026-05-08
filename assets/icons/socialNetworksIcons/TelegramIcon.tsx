import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const TelegramIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path
                fill={color || '#000'}
                fillRule="evenodd"
                d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10Zm-9.642-2.618c-.972.405-2.916 1.242-5.831 2.512-.474.189-.722.373-.744.553-.039.304.343.424.862.587l.218.07c.51.166 1.198.36 1.555.368.324.007.685-.127 1.084-.4 2.724-1.84 4.13-2.769 4.218-2.789.063-.014.149-.032.207.02.059.052.053.15.047.177-.038.16-1.534 1.552-2.308 2.271-.241.225-.413.384-.448.42a8.817 8.817 0 0 1-.235.233c-.474.457-.83.8.02 1.36.408.27.735.492 1.061.714.356.242.711.484 1.17.785.118.077.23.156.338.234.415.296.787.56 1.247.518.267-.024.543-.275.683-1.025.332-1.77.983-5.608 1.133-7.19a1.764 1.764 0 0 0-.017-.393.422.422 0 0 0-.142-.27c-.12-.098-.305-.118-.387-.117-.377.007-.954.207-3.73 1.362Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
