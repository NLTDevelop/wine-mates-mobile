import { useMemo } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { LANGUAGE_OPTIONS } from '../constants/languageOptions';
import { languageDisplayNames } from '../constants/languageDisplayNames';

type LanguageDisplayNames = {
    of: (code: string) => string | undefined;
};

const LANGUAGE_CODE_ALIASES: Record<string, string> = {
    ua: 'uk',
};

const getDisplayNames = (locale: string): LanguageDisplayNames | null => {
    const DisplayNames = (Intl as typeof Intl & { DisplayNames?: any }).DisplayNames;

    if (typeof DisplayNames !== 'function') {
        return null;
    }

    try {
        return new DisplayNames([locale], { type: 'language' });
    } catch {
        return null;
    }
};

const resolveLanguageCode = (code: string) => {
    return LANGUAGE_CODE_ALIASES[code] || code;
};

const resolveLocale = (locale: string) => {
    const normalizedLocale = locale.toLowerCase().split(/[-_]/)[0];
    if (normalizedLocale === 'ua') {
        return 'uk';
    }

    return normalizedLocale;
};

export const useLocalizedLanguageOptions = () => {
    const locale = localization.locale || 'en';
    const resolvedLocale = resolveLocale(locale);

    const languageOptions = useMemo(() => {
        const displayNames = getDisplayNames(resolvedLocale);
        const customNames = languageDisplayNames[resolvedLocale];
        const localizedData = LANGUAGE_OPTIONS.map((item) => {
            const resolvedCode = resolveLanguageCode(item.code);
            const localizedName = customNames?.[item.code] || displayNames?.of(resolvedCode);

            if (!localizedName) {
                return item;
            }

            return {
                ...item,
                name: localizedName,
            };
        });

        return localizedData.sort((a, b) => a.name.localeCompare(b.name, resolvedLocale));
    }, [resolvedLocale]);

    return {
        locale: resolvedLocale,
        languageOptions,
    };
};
