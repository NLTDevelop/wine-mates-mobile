import { HomeSectionKey } from '../types/HomeSectionKey';
import { IHomeSectionsListParams } from '../params/IHomeSectionsListParams';

export interface IUpdateHomeSectionItemDto {
    key: HomeSectionKey;
    sortOrder: number;
    isVisible: boolean;
}

export interface UpdateHomeSectionsDto extends IHomeSectionsListParams {
    sections: IUpdateHomeSectionItemDto[];
}
