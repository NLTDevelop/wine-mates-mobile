export interface ILocalization {
    readonly locales: string[];
    readonly locale: 'uk' | 'en' | string;
    t: (key: string, params?: Record<string, any>) => string;
    setTranslation: (translations: any) => void;
    setLocale: (value: string) => void;
}
