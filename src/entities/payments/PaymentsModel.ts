import { MobXRepository } from "@/repository/MobXRepository";
import { IPaymentsListItem } from "./types/IPaymentsListItem";

export interface IPaymentsModel {
    list: IPaymentsListItem[] | null;
    appened: (payment: IPaymentsListItem) => void;
    clear: () => void;
}

class PaymentsModel implements IPaymentsModel {
    private listRepository = new MobXRepository<IPaymentsListItem[] | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IPaymentsListItem[] | null) {
        this.listRepository.save(value);
    }

    public appened(payment: IPaymentsListItem) {
        this.list = [...(this.list || []), payment];
    }

    public clear() {
        this.list = null;
    }
}

export const paymentsModel = new PaymentsModel();
