export type TTheme = 'light' | 'dark';

export type IColors = {
    background: string;
    border: string;

    text: string;
    text_light: string;
    text_inverted: string;
    text_primary: string;

    icon: string;

    primary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
};

export type FontStyle = {
    fontFamily: string;
    fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export interface IFonts {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
}
