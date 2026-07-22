import { IAppealFile } from './IAppealFile';

export interface IAppealPhoto extends IAppealFile {
    file?: IAppealFile;
}
