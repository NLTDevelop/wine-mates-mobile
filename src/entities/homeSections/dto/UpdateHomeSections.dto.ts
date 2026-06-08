import { HomeSectionKey } from '../types/HomeSectionKey';

export interface IUpdateHomeSectionItemDto {
    key: HomeSectionKey;
    sortOrder: number;
    isVisible: boolean;
}

export interface UpdateHomeSectionsDto {
    sections: IUpdateHomeSectionItemDto[];
}
