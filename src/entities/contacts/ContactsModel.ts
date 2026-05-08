import { MobXRepository } from "@/repository/MobXRepository";
import { IContactsListItem } from "./types/IContactsListItem";

export interface IContactsModel {
    list: IContactsListItem[] | null;
    append: (payment: IContactsListItem) => void;
    clear: () => void;
}

class ContactsModel implements IContactsModel {
    private listRepository = new MobXRepository<IContactsListItem[] | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IContactsListItem[] | null) {
        this.listRepository.save(value);
    }

    public append(payment: IContactsListItem) {
        this.list = [...(this.list || []), payment];
    }

    public clear() {
        this.list = null;
    }
}

export const contactsModel = new ContactsModel();
