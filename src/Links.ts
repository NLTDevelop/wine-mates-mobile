import { storage } from './libs/storage';
import { config } from './config';

const ENVIRONMENT_STORAGE_KEY = 'STORAGE_IS_DEV_ENVIRONMENT';

const getInitialIsDev = () => {
    const storedValue = storage.get(ENVIRONMENT_STORAGE_KEY);

    if (typeof storedValue === 'boolean') {
        return storedValue;
    }

    storage.set(ENVIRONMENT_STORAGE_KEY, true);
    return true;
};

export interface ILinks {
    auth: string;
    resetPassword: string;
    features: string;
    wines: string;
    wineFilters: string;
    scannedWines: string;
    wineTypes: string;
    wineColors: string;
    wineColorShades: string;
    wineSmells: string;
    wineAromas: string;
    wineTaste: string;
    wineTasteGroups: string;
    wineTasteCharacteristic: string;
    countries: string;
    rates: string;
    generateSnacks: string;
    generateNote: string;
    getContext: string;
    myWine: string;
    tasteProfile: string;
    wineRecommendations: string;
}

class Links implements ILinks {
    private isDev = getInitialIsDev();
    private _domain = this.buildDomain();
    private _links = {
        auth: 'auth',
        resetPassword: 'auth/reset-password',
        features: 'features',
        wines: 'wines',
        wineFilters: 'wines/filters',
        scannedWines: 'wines/scanner',
        wineTypes: 'wine-types',
        wineColors: 'wine-colors',
        wineColorShades: 'wine-color-shades',
        wineSmells: 'wine-aroma-groups',
        wineAromas: 'wine-aromas',
        wineTaste: 'wine-flavors',
        wineTasteGroups: 'wine-flavor-groups',
        wineTasteCharacteristic: 'wine-taste-characteristics',
        countries: 'countries',
        rates: 'rates',
        generateSnacks: 'rates/generate-snacks',
        generateNote: 'rates/generate-note',
        getContext: 'rates/context',
        myWine: 'myWine',
        tasteProfile: 'users/taste-profile',
        wineRecommendations: 'users/taste-profile/wine-recommendations',
    };

    private buildDomain() {
        return this.isDev ? `${config.devDomain}` : `${config.localDomain}`;
    }

    private persistEnvironment = () => {
        storage.set(ENVIRONMENT_STORAGE_KEY, this.isDev);
    };

    public toggleEnvironment() {
        this.isDev = !this.isDev;
        this.persistEnvironment();
        this._domain = this.buildDomain();
    }

    public get isDevEnvironment() {
        return this.isDev;
    }

    public get auth() {
        return `${this._domain}${this._links.auth}`;
    }
    public get resetPassword() {
        return `${this._domain}${this._links.resetPassword}`;
    }
    public get features() {
        return `${this._domain}${this._links.features}`;
    }
    public get wines() {
        return `${this._domain}${this._links.wines}`;
    }
    public get wineFilters() {
        return `${this._domain}${this._links.wineFilters}`;
    }
    public get scannedWines() {
        return `${this._domain}${this._links.scannedWines}`;
    }
    public get wineTypes() {
        return `${this._domain}${this._links.wineTypes}`;
    }
    public get wineColors() {
        return `${this._domain}${this._links.wineColors}`;
    }
    public get wineColorShades() {
        return `${this._domain}${this._links.wineColorShades}`;
    }
    public get wineSmells() {
        return `${this._domain}${this._links.wineSmells}`;
    }
    public get wineAromas() {
        return `${this._domain}${this._links.wineAromas}`;
    }
    public get wineTaste() {
        return `${this._domain}${this._links.wineTaste}`;
    }
    public get wineTasteGroups() {
        return `${this._domain}${this._links.wineTasteGroups}`;
    }
    public get wineTasteCharacteristic() {
        return `${this._domain}${this._links.wineTasteCharacteristic}`;
    }
    public get countries() {
        return `${this._domain}${this._links.countries}`;
    }
    public get rates() {
        return `${this._domain}${this._links.rates}`;
    }
    public get generateSnacks() {
        return `${this._domain}${this._links.generateSnacks}`;
    }
    public get generateNote() {
        return `${this._domain}${this._links.generateNote}`;
    }
    public get getContext() {
        return `${this._domain}${this._links.getContext}`;
    }
    public get myWine() {
        return `${this._domain}${this._links.myWine}`;
    }
    public get tasteProfile() {
        return `${this._domain}${this._links.tasteProfile}`;
    }
    public get wineRecommendations() {
        return `${this._domain}${this._links.wineRecommendations}`;
    }
}

export const links = new Links();
