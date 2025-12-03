import { Dimensions, PixelRatio, Platform } from 'react-native';
import { formatDistanceToNowStrict, Locale, parse } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';

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

export const formatRelativeDate = (raw: string | number | Date, localeCode: string = 'en') => {
    const localeMap: Record<string, Locale> = { en: enUS, uk };
    const selectedLocale = localeMap[localeCode] || enUS;

    if (!raw) return '';

    let parsed: Date;

    if (typeof raw === 'string') {
        const isoDate = new Date(raw);
        if (!Number.isNaN(isoDate.getTime())) {
            parsed = isoDate;
        } else {
            parsed = parse(raw, 'dd.MM.yyyy', new Date());
        }
    } else {
        parsed = new Date(raw);
    }

    if (Number.isNaN(parsed.getTime())) return String(raw);

    return formatDistanceToNowStrict(parsed, {
        addSuffix: false,
        locale: selectedLocale,
        roundingMethod: 'floor',
    });
};
