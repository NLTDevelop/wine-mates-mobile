export type TTheme = 'light' | 'dark';

export type IColors = {
    background: string;
    background_inverted: string;
    background_secondary: string;
    background_light: string;
    background_middle: string;
    background_grey: string;
    background_disabled: string;

    border: string;
    border_light: string;
    border_strong: string;

    card: string;

    notification: string;

    shadow: string;

    text: string;
    text_light: string;
    text_inverted: string;
    text_primary: string;
    text_middle: string;

    icon: string;
    icon_inverted: string;
    icon_primary: string;

    unselectedSlider: string;
    selectedSlider: string;

    primary: string;
    primary_secondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;

    stars: string;
    lockBackground: string;
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
