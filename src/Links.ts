import { config } from './config';

export interface ILinks {
    auth: string;
    resetPassword: string;
    features: string;
}

class Links implements ILinks {
    private _domain = `${config.domain}`;
    private _links = {
        auth: 'auth',
        resetPassword: 'auth/reset-password',
        features: 'features',
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
}

export const links = new Links();
