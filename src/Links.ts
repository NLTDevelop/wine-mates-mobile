import { config } from './config';

export interface ILinks {
    auth: string;
    resetPassword: string;
}

class Links implements ILinks {
    private _domain = `${config.domain}`;
    private _links = {
        auth: 'auth',
        resetPassword: 'reset-password',
    };

    public get auth() {
        return `${this._domain}${this._links.auth}`;
    }
    public get resetPassword() {
        return `${this._domain}${this._links.resetPassword}`;
    }
}

export const links = new Links();
