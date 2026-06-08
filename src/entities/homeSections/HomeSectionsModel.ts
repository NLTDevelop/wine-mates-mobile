import { MobXRepository } from '@/repository/MobXRepository';
import { IHomeSection } from './types/IHomeSection';

export interface IHomeSectionsModel {
    sections: IHomeSection[];
}

class HomeSectionsModel implements IHomeSectionsModel {
    private sectionsRepository = new MobXRepository<IHomeSection[]>([]);

    public get sections() {
        return this.sectionsRepository.data || [];
    }

    public set sections(sections: IHomeSection[]) {
        this.sectionsRepository.save(sections);
    }

}

export const homeSectionsModel = new HomeSectionsModel();
