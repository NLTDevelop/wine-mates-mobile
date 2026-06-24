import { useCallback, useDeferredValue, useMemo, useState, type SetStateAction } from 'react';
import { Dimensions } from 'react-native';
import { useLocalizedLanguageOptions } from '../../../presenters/useLocalizedLanguageOptions';

const windowHeight = Dimensions.get('window').height;

export const useLanguagePickerModal = () => {
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);
    const { locale, languageOptions } = useLocalizedLanguageOptions();

    const languagesData = useMemo(() => {
        const query = deferredSearch.trim().toLocaleLowerCase(locale);

        if (!query) {
            return languageOptions;
        }

        return languageOptions.filter((item) => {
            const name = item.name.toLocaleLowerCase(locale);
            const code = item.code.toLocaleLowerCase();
            return name.includes(query) || code.includes(query);
        });
    }, [deferredSearch, languageOptions, locale]);

    const onChangeSearch = useCallback((value: SetStateAction<string>) => {
        setSearch(value);
    }, []);

    const snapPoints = useMemo(() => [windowHeight], []);

    return {
        search,
        languagesData,
        onChangeSearch,
        snapPoints,
    };
};
