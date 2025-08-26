import { I18n } from 'i18n-js';
import uk from './translations/uk.json';
import en from './translations/en.json';
import { ILocalization } from './ILocalization';
import { IRepository } from '../../repository/IRepository';
import { MobXRepository } from '../../repository/MobXRepository';
import { IStorage, storage } from '../../libs/storage';

class Localization implements ILocalization {
    private i18n!: I18n;

    constructor(private localizationStore: IRepository<string>, private storage: IStorage) {
        this.i18n = new I18n();
        this.i18n.enableFallback = true;
        this.i18n.translations = { uk, en };
        this.load();
    }

    private load = () => {
        try {
            const language = this.storage.get('LANGUAGE');
            if (language) {
                this.localizationStore.save(language);
            }
            const translations = this.storage.get('TRANSLATIONS');
            if (translations) {
                this.i18n.translations = translations;
            }
        } catch (error) {
            console.warn('Localization -> load: ', error);
        }
    };

    private persistLanguage = (data: string | null) => {
        if (data) {
            this.storage.set('LANGUAGE', data);
        } else {
            this.storage.remove('LANGUAGE');
        }
    };

    private persistTranslations = (data: object) => {
        if (data) {
            this.storage.set('TRANSLATIONS', data);
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
        return this.i18n.t(key, { locale: locale, ...params });
    };

    setLocale = (locale: string) => {
        this.localizationStore.save(locale);
        this.persistLanguage(locale);
    };
}

const localizationStore = new MobXRepository<string>('en');
export const localization = new Localization(localizationStore, storage);
