import { storage } from './libs/storage';
import { config } from './config';

const ENVIRONMENT_STORAGE_KEY = 'STORAGE_IS_DEV_ENVIRONMENT';

const getInitialIsDev = () => {
    const storedValue = storage.get(ENVIRONMENT_STORAGE_KEY);

    if (typeof storedValue === 'boolean') {
        return storedValue;
    }

    storage.set(ENVIRONMENT_STORAGE_KEY, true);
    return true;
};

export interface ILinks {
    auth: string;
    resetPassword: string;
    device: string;
    deviceUnregister: string;
    features: string;
    homeSections: string;
    wines: string;
    wineFilters: string;
    wineSetSearch: string;
    wineEventDetails: string;
    scannedWines: string;
    wineTypes: string;
    wineColors: string;
    wineColorShades: string;
    wineSmells: string;
    wineAromas: string;
    wineTaste: string;
    wineTasteGroups: string;
    wineTasteCharacteristic: string;
    countries: string;
    rates: string;
    eventRates: string;
    generateSnacks: string;
    wineSnackCuisines: string;
    generateNote: string;
    generateBlindNote: string;
    getContext: string;
    myWine: string;
    tasteProfile: string;
    wineRecommendations: string;
    wineChooser: string;
    wineChooserCountries: string;
    wineChooserRegions: string;
    wineChooserGrapeVarieties: string;
    wineChooserPrefill: string;
    wineChooserAromasFlavors: string;
    faq: string;
    me: string;
    favoriteWineLists: string;
    favoriteEvents: string;
    events: string;
    eventMapPins: string;
    eventPriceRange: string;
    createdEvents: string;
    appliedEvents: string;
    eventBookings: string;
    userCurrencies: string;
    paymentMethods: string;
    contacts: string;
    guests: string;
    guestsStatuses: string;
    eventTastingDraft: string;
    eventTastingSaveDraft: string;
    userLocation: string;
}

class Links implements ILinks {
    private isDev = getInitialIsDev();
    private _domain = this.buildDomain();
    private _links = {
        auth: 'auth',
        resetPassword: 'auth/reset-password',
        device: 'users/devices/register',
        deviceUnregister: 'users/devices/unregister',
        features: 'features',
        homeSections: 'home-sections',
        wines: 'wines',
        wineFilters: 'wines/filters',
        wineSetSearch: 'wines/search/wine-set',
        wineEventDetails: 'wines',
        scannedWines: 'wines/scanner',
        wineTypes: 'wine-types',
        wineColors: 'wine-colors',
        wineColorShades: 'wine-color-shades',
        wineSmells: 'wine-aroma-groups',
        wineAromas: 'wine-aromas',
        wineTaste: 'wine-flavors',
        wineTasteGroups: 'wine-flavor-groups',
        wineTasteCharacteristic: 'wine-taste-characteristics',
        countries: 'countries',
        rates: 'rates',
        eventRates: 'rates/event-rates',
        generateSnacks: 'rates/generate-snacks',
        wineSnackCuisines: 'wine-snack-cuisines',
        generateNote: 'rates/generate-note',
        generateBlindNote: 'rates/generate-blind-note',
        getContext: 'rates/context',
        myWine: 'myWine',
        tasteProfile: 'users/taste-profile',
        wineRecommendations: 'users/taste-profile/wine-recommendations',
        wineChooser: 'wine-chooser',
        wineChooserCountries: 'wine-chooser/countries',
        wineChooserRegions: 'wine-chooser/regions',
        wineChooserGrapeVarieties: 'wine-chooser/grape-varieties',
        wineChooserPrefill: 'wine-chooser/prefill',
        wineChooserAromasFlavors: 'wine-chooser/aromas-flavors',
        faq: 'faq/topics',
        me: 'users/me',
        favoriteWineLists: 'favorite/wine-lists',
        favoriteEvents: 'favorite/events',
        events: 'events',
        eventMapPins: 'events/map-pins',
        eventPriceRange: 'events/price-range',
        createdEvents: 'events/my',
        appliedEvents: 'event-bookings/my',
        eventBookings: 'event-bookings',
        userCurrencies: 'users/currencies',
        paymentMethods: 'users/payment-methods',
        contacts: 'users/contacts',
        guests: 'event-bookings/event',
        guestsStatuses: 'event-bookings',
        eventTastingDraft: 'event-tasting/draft',
        eventTastingSaveDraft: 'event-tasting/save-draft',
        userLocation: 'users/location',
    };

    private buildDomain() {
        return this.isDev ? `${config.devDomain}` : `${config.localDomain}`;
    }

    private persistEnvironment = () => {
        storage.set(ENVIRONMENT_STORAGE_KEY, this.isDev);
    };

    public toggleEnvironment() {
        this.isDev = !this.isDev;
        this.persistEnvironment();
        this._domain = this.buildDomain();
    }

    public get isDevEnvironment() {
        return this.isDev;
    }

    public get auth() {
        return `${this._domain}${this._links.auth}`;
    }
    public get resetPassword() {
        return `${this._domain}${this._links.resetPassword}`;
    }
    public get device() {
        return `${this._domain}${this._links.device}`;
    }
    public get deviceUnregister() {
        return `${this._domain}${this._links.deviceUnregister}`;
    }
    public get features() {
        return `${this._domain}${this._links.features}`;
    }
    public get homeSections() {
        return `${this._domain}${this._links.homeSections}`;
    }
    public get wines() {
        return `${this._domain}${this._links.wines}`;
    }
    public get wineFilters() {
        return `${this._domain}${this._links.wineFilters}`;
    }
    public get wineSetSearch() {
        return `${this._domain}${this._links.wineSetSearch}`;
    }
    public get wineEventDetails() {
        return `${this._domain}${this._links.wineEventDetails}`;
    }
    public get scannedWines() {
        return `${this._domain}${this._links.scannedWines}`;
    }
    public get wineTypes() {
        return `${this._domain}${this._links.wineTypes}`;
    }
    public get wineColors() {
        return `${this._domain}${this._links.wineColors}`;
    }
    public get wineColorShades() {
        return `${this._domain}${this._links.wineColorShades}`;
    }
    public get wineSmells() {
        return `${this._domain}${this._links.wineSmells}`;
    }
    public get wineAromas() {
        return `${this._domain}${this._links.wineAromas}`;
    }
    public get wineTaste() {
        return `${this._domain}${this._links.wineTaste}`;
    }
    public get wineTasteGroups() {
        return `${this._domain}${this._links.wineTasteGroups}`;
    }
    public get wineTasteCharacteristic() {
        return `${this._domain}${this._links.wineTasteCharacteristic}`;
    }
    public get countries() {
        return `${this._domain}${this._links.countries}`;
    }
    public get rates() {
        return `${this._domain}${this._links.rates}`;
    }
    public get eventRates() {
        return `${this._domain}${this._links.eventRates}`;
    }
    public get generateSnacks() {
        return `${this._domain}${this._links.generateSnacks}`;
    }
    public get wineSnackCuisines() {
        return `${this._domain}${this._links.wineSnackCuisines}`;
    }
    public get generateNote() {
        return `${this._domain}${this._links.generateNote}`;
    }
    public get generateBlindNote() {
        return `${this._domain}${this._links.generateBlindNote}`;
    }
    public get getContext() {
        return `${this._domain}${this._links.getContext}`;
    }
    public get myWine() {
        return `${this._domain}${this._links.myWine}`;
    }
    public get tasteProfile() {
        return `${this._domain}${this._links.tasteProfile}`;
    }
    public get wineRecommendations() {
        return `${this._domain}${this._links.wineRecommendations}`;
    }
    public get wineChooser() {
        return `${this._domain}${this._links.wineChooser}`;
    }
    public get wineChooserCountries() {
        return `${this._domain}${this._links.wineChooserCountries}`;
    }
    public get wineChooserRegions() {
        return `${this._domain}${this._links.wineChooserRegions}`;
    }
    public get wineChooserGrapeVarieties() {
        return `${this._domain}${this._links.wineChooserGrapeVarieties}`;
    }
    public get wineChooserPrefill() {
        return `${this._domain}${this._links.wineChooserPrefill}`;
    }
    public get wineChooserAromasFlavors() {
        return `${this._domain}${this._links.wineChooserAromasFlavors}`;
    }
    public get faq() {
        return `${this._domain}${this._links.faq}`;
    }
    public get me() {
        return `${this._domain}${this._links.me}`;
    }
    public get favoriteWineLists() {
        return `${this._domain}${this._links.favoriteWineLists}`;
    }
    public get favoriteEvents() {
        return `${this._domain}${this._links.favoriteEvents}`;
    }
    public get events() {
        return `${this._domain}${this._links.events}`;
    }
    public get eventMapPins() {
        return `${this._domain}${this._links.eventMapPins}`;
    }
    public get eventPriceRange() {
        return `${this._domain}${this._links.eventPriceRange}`;
    }
    public get createdEvents() {
        return `${this._domain}${this._links.createdEvents}`;
    }
    public get appliedEvents() {
        return `${this._domain}${this._links.appliedEvents}`;
    }
    public get eventBookings() {
        return `${this._domain}${this._links.eventBookings}`;
    }
    public get userCurrencies() {
        return `${this._domain}${this._links.userCurrencies}`;
    }
    public get paymentMethods() {
        return `${this._domain}${this._links.paymentMethods}`;
    }
    public get contacts() {
        return `${this._domain}${this._links.contacts}`;
    }
    public get guests() {
        return `${this._domain}${this._links.guests}`;
    }
    public get guestsStatuses() {
        return `${this._domain}${this._links.guestsStatuses}`;
    }
    public get eventTastingDraft() {
        return `${this._domain}${this._links.eventTastingDraft}`;
    }
    public get eventTastingSaveDraft() {
        return `${this._domain}${this._links.eventTastingSaveDraft}`;
    }
    public get userLocation() {
        return `${this._domain}${this._links.userLocation}`;
    }
}

export const links = new Links();
