import { IColors, IFonts, TTheme } from './IColors';

export interface IColorTheme {
    theme: TTheme;
    colors: IColors;
    setTheme: (value: TTheme) => void;
    fonts: IFonts;
}
