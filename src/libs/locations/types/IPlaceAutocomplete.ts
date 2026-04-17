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
    country?: string;
}
