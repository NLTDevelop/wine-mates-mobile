export type LoggerType = 'request' | 'response' | 'error' | 'library';

export interface ILog {
    type: LoggerType;
    name: string;
    message: string;
    id: string;
}
