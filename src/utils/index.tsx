import { Dimensions, PixelRatio, Platform } from 'react-native';
import { differenceInSeconds, formatDistanceToNowStrict, Locale, parse } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';

export const isIOS = Platform.OS === 'ios';

const idealWidth: number = 375;
const idealHeight: number = 812;
export const size: { width: number; height: number } = Dimensions.get('window');
const ratio: number = PixelRatio.getFontScale();

export const scaleHorizontal = (inWidth: number = 1): number => {
    const delimiter: number = idealWidth / inWidth;
    return size.width / delimiter;
};

export const scaleVertical = (inHeight: number = 1) => {
    const delimiter: number = idealHeight / inHeight;
    return size.height / delimiter;
};

export const scaleFontSize = (fontSize: number = 1): number => {
    const divisionRatio: number = idealWidth / (fontSize / ratio);
    return size.width / divisionRatio;
};

export const scaleLineHeight = (lineHeight: number = 1): number => {
    const divisionRatio = idealHeight / (lineHeight / ratio);
    let result = size.height / divisionRatio;

    // Correction for small screens ( <700px height)
    if (size.height < 700) {
        result += 4;
    }

    return result;
};

export const declOfWord = (num: number, word: Array<string>): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    if (Array.isArray(word)) {
        return `${num} ${
            // @ts-ignore
            word[num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]] || word[2]
        }`;
    }
    return '';
};

export const hexToRgba = (hex: string, alpha: number): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const parseDate = (raw: string | number | Date) => {
    let parsed: Date;

    if (typeof raw === 'string') {
        const isoDate = new Date(raw);
        parsed = !Number.isNaN(isoDate.getTime()) ? isoDate : parse(raw, 'dd.MM.yyyy', new Date());
    } else {
        parsed = new Date(raw);
    }

    if (Number.isNaN(parsed.getTime())) return null;

    return parsed;
};

export const formatRelativeDate = (raw: string | number | Date, localeCode: string = 'en') => {
    const localeMap: Record<string, Locale> = { en: enUS, uk };
    const selectedLocale = localeMap[localeCode] || enUS;

    if (!raw) return '';

    const parsed = parseDate(raw);

    if (!parsed) return String(raw);

    return formatDistanceToNowStrict(parsed, {
        addSuffix: false,
        locale: selectedLocale,
        roundingMethod: 'floor',
    });
};

export const isLessThanMinuteFromNow = (raw: string | number | Date) => {
    if (!raw) return false;

    const parsed = parseDate(raw);

    if (!parsed) return false;

    return Math.abs(differenceInSeconds(new Date(), parsed)) < 60;
};

export const getContrastColor = (hexColor: string) => {
    hexColor = hexColor.replace('#', '');

    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? colorTheme.colors.text : colorTheme.colors.text_inverted;
};

export const colorOpacity = (
    hex: string,
    opacityPercent: number
): string => {

    let cleanHex = hex.replace('#', '');

    if (cleanHex.length === 3) {
        cleanHex = cleanHex
            .split('')
            .map(c => c + c)
            .join('');
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        throw new Error(`Invalid hex color: ${hex}`);
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    const alpha = Math.min(100, Math.max(0, opacityPercent)) / 100;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


