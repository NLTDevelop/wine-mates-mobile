import { TastingType } from '../enums/TastingType';

export interface IEventMapPin {
    id: number;
    latitude: number;
    longitude: number;
    tastingType: TastingType;
}
