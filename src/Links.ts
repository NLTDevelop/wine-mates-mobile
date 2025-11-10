import { config } from './config';

const isDev = false;

export interface ILinks {
    auth: string;
    resetPassword: string;
    features: string;
    wine: string;
}

class Links implements ILinks {
    private _domain = isDev ? `${config.devDomain}` : `${config.domain}`;
    private _links = {
        auth: 'auth',
        resetPassword: 'auth/reset-password',
        features: 'features',
        wine: 'wine',
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
}

export const links = new Links();
