import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import uk from './translations/uk.json';
import en from './translations/en.json';
import { IRepository } from '@/repository/IRepository';
import { MobXRepository } from '@/repository/MobXRepository';
import { IStorage, storage } from '@/libs/storage';
import { ILocalization } from './ILocalization';

class Localization implements ILocalization {
    private i18n: I18n;

    constructor(private localizationStore: IRepository<string>, private _storage: IStorage) {
        this.i18n = new I18n();
        this.i18n.enableFallback = true;
        this.i18n.translations = { uk, en };

        this.load();
    }

    private load = () => {
        try {
            const supportedLocales = Object.keys(this.i18n.translations);

            const savedLanguage = this._storage.get('LANGUAGE');
            const locales = RNLocalize.getLocales();
            const deviceLang = locales?.[0]?.languageCode;

            let finalLanguage: string | null = null;

            if (savedLanguage && supportedLocales.includes(savedLanguage)) {
                finalLanguage = savedLanguage;
            } else if (deviceLang && supportedLocales.includes(deviceLang)) {
                finalLanguage = deviceLang;
            } else {
                finalLanguage = 'en';
            }

            if (finalLanguage !== savedLanguage) {
                this.persistLanguage(finalLanguage);
            }
    
            const translations = this._storage.get('TRANSLATIONS');
            if (translations) {
                this.i18n.translations = translations;
            }
            
            this.i18n.locale = finalLanguage;
            this.localizationStore.save(finalLanguage);
        } catch (error) {
            console.warn('Localization -> load: ', error);
            this.localizationStore.save('en');
            this.i18n.locale = 'en';
        }
    };

    private persistLanguage = (data: string | null) => {
        if (data) {
            this._storage.set('LANGUAGE', data);
        } else {
            this._storage.remove('LANGUAGE');
        }
    };

    private persistTranslations = (data: object) => {
        if (data) {
            this._storage.set('TRANSLATIONS', data);
        }
    };

    get locales() {
        return Object.keys(this.i18n.translations);
    }

    get locale() {
        return this.localizationStore.data || 'en';
    }

    setTranslation = (translations: any) => {
        if (typeof translations === 'object' && translations) {
            this.i18n.translations = translations;
            this.persistTranslations(translations);
        }
    };

    t = (key: string, params: Record<string, any> = {}) => {
        const locale = this.localizationStore.data;
        return this.i18n.t(key, { locale, ...params });
    };

    setLocale = (locale: string) => {
        const supported = Object.keys(this.i18n.translations).includes(locale) ? locale : 'en';

        this.localizationStore.save(supported);
        this.persistLanguage(supported);

        this.i18n.locale = supported;
    };
}

const localizationStore = new MobXRepository<string>('en');
export const localization = new Localization(localizationStore, storage);
