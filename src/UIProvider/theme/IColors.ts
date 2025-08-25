export type TTheme = 'light' | 'dark';

export type IColors = {
    background: string;
    background_secondary: string;
    background_middle: string;
    background_light: string;
    card: string;
    card_secondary: string;
    card_light: string;
    notification: string;
    border: string;
    border_light: string;
    shadow: string;

    text: string;
    text_strong: string;
    text_middle: string;
    text_light: string;
    text_secondary: string;
    text_inverted: string;
    text_primary: string;
    text_error: string;
    text_card: string;

    icon_strong: string;
    icon_middle: string;
    icon_light: string;
    icon_secondary: string;
    icon_inverted: string;
    icon_primary: string;
    icon_error: string;

    primary: string;
    primary_secondary: string;
    primary_secondary_dark: string;
    primary_tertiary: string;
    primary_fourth: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    error_strong: string;
    warning_strong: string;
    success_strong: string;
    info_strong: string;
    error_light: string;
    warning_light: string;
    success_light: string;
    info_light: string;
    // ------------------------------------
    basic: string;
    expand: string;
    astra: string;
    obsidian: string;
    horizon: string;
    fog: string;
    deep: string;
    sun: string;
    stone_cold: string;
    zarun: string;
    drain: string;
    pyro: string;
    chlorine: string;
    lime: string; //done
    blue_100: string; //done
    light_blue_100: string;
    violet_100: string; //done
    orange_100: string; //done
    tertiary_12: string; //done
    yellow_100: string; //done
    yellow_25: string; //done
    purple_25: string; //done
    mint_12: string; //done
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
