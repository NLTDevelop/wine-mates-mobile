import { Currency } from '../enums/Currency';
import { RepeatRule } from '../enums/RepeatRule';
import { TastingType } from '../enums/TastingType';
import { Sex } from '../enums/Sex';

interface IWineSetItem {
    wineId: number;
    sortOrder: number;
}

export interface CreateEventDto {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    latitude: number;
    longitude: number;
    eventDate: string;
    eventTime: string;
    price: number;
    currency: Currency;
    speakerName: string;
    language: string;
    seats: number;
    phoneNumber: string;
    age: number;
    sex: Sex;
    tastingType: TastingType;
    requiresConfirmation: boolean;
    repeatRule: RepeatRule;
    wineSet?: IWineSetItem[];
}
