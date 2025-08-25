import { MobXRepository } from '../../../repository/MobXRepository';

export interface ILog {
    type: 'request' | 'response' | 'error' | 'library';
    name: string;
    message: string;
    id: string;
}

interface ILoggerModel {
    isVisibleLogs: boolean;
    readonly logs: ILog[];
}

class LoggerModel implements ILoggerModel {
    private logsRepository = new MobXRepository<ILog[]>([]);
    private isVisibleLogsRepository = new MobXRepository<boolean>(false);

    get logs() {
        return this.logsRepository.data ?? [];
    }

    get isVisibleLogs() {
        return this.isVisibleLogsRepository.data ?? false;
    }

    set isVisibleLogs(data: boolean) {
        this.isVisibleLogsRepository.save(data);
    }

    add = (type: 'request' | 'response' | 'error' | 'library', name: string, message: string) => {
        this.logsRepository.save([{ type, name, message, id: Date.now().toString() }, ...this.logs]);
    };

    clear = () => {
        this.logsRepository.save(null);
    };
}

export const loggerModel = new LoggerModel();
