export interface IPlaceAutocomplete {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
}

export interface IPlaceDetails {
    latitude: number;
    longitude: number;
    address: string;
    countryCode?: string;
}

export interface IReverseGeocodeDetails {
    address: string;
    countryCode: string;
}
