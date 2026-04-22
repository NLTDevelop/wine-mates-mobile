import { IConfig } from "./types/IConfig";

let localConfig: Partial<IConfig> = {};

try {
    localConfig = require('./config.local').localConfig || {};
} catch {
    localConfig = {};
}

const baseConfig: IConfig = {
    devDomain: 'https://wine-mates.nltdev.pp.ua/api/v1/',
    localDomain: 'https://fh1vhkjl-3030.euw.devtunnels.ms/api/v1/',
    googlePlacesApiKey: '',
};

export const config: IConfig = {
    ...baseConfig,
    ...localConfig,
};
