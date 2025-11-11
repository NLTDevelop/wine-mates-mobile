import { config } from './config';

const isDev = false;

export interface ILinks {
    auth: string;
    resetPassword: string;
    features: string;
    wine: string;
    wineTypes: string;
    wineColors: string;
    wineColorShades: string;
}

class Links implements ILinks {
    private _domain = isDev ? `${config.devDomain}` : `${config.domain}`;
    private _links = {
        auth: 'auth',
        resetPassword: 'auth/reset-password',
        features: 'features',
        wine: 'wine',
        wineTypes: 'wine-types',
        wineColors: 'wine-colors',
        wineColorShades: 'wine-color-shades',
    };
    public get auth() {
        return `${this._domain}${this._links.auth}`;
    }
    public get resetPassword() {
        return `${this._domain}${this._links.resetPassword}`;
    }
    public get features() {
        return `${this._domain}${this._links.features}`;
    }
    public get wine() {
        return `${this._domain}${this._links.wine}`;
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
}

export const links = new Links();
