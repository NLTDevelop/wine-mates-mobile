import { config } from "./config";

export interface ILinks {
    auth: string;
    changePassword: string;
}

class Links implements ILinks {
    private _domain = `${config.domain}/api/`;
    private _links = {
        auth: 'auth',
        changePassword: 'change-password',
    };

    public get auth() {
        return `${this._domain}${this._links.auth}`;
    }
    public get changePassword() {
        return `${this._domain}${this._links.changePassword}`;
    }
}

export const links = new Links();
