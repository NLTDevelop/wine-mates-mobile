import { IStorageCleanAll, IStorageCleanOnFirstLaunch, IStorageGet, IStorageRemove, IStorageSet } from '..';

export interface IStorage
    extends IStorageGet, IStorageSet, IStorageRemove, IStorageCleanAll, IStorageCleanOnFirstLaunch {}
