import { storage } from './MMKVStorage';

export const TASTE_CHARACTERISTICS_CACHE_KEY = 'wine_taste_characteristics_slider_values';
export const WINE_SNACK_CUISINES_CACHE_KEY = 'wine_snack_cuisines_values';

export interface IWineSnackCuisineCacheItem {
    id: number;
    name: string;
}

interface ITasteCharacteristicsCacheContext {
    wineId?: number | null;
    colorId?: number | null;
    typeId?: number | null;
}

interface ITasteCharacteristicsCachePayload {
    context: ITasteCharacteristicsCacheContext;
    values: Record<number, number>;
}

interface IWineSnackCuisinesCachePayload {
    wineId?: number | null;
    values: IWineSnackCuisineCacheItem[];
}

const isSameTasteCharacteristicsContext = (
    left: ITasteCharacteristicsCacheContext,
    right: ITasteCharacteristicsCacheContext,
) => {
    return left.wineId === right.wineId && left.colorId === right.colorId && left.typeId === right.typeId;
};

export const getTasteCharacteristicsCache = (context: ITasteCharacteristicsCacheContext) => {
    const payload = storage.get(TASTE_CHARACTERISTICS_CACHE_KEY) as ITasteCharacteristicsCachePayload | null;

    if (!payload || !isSameTasteCharacteristicsContext(payload.context, context)) {
        return null;
    }

    return payload.values;
};

export const setTasteCharacteristicsCache = (
    context: ITasteCharacteristicsCacheContext,
    values: Record<number, number>,
) => {
    storage.set(TASTE_CHARACTERISTICS_CACHE_KEY, {
        context,
        values,
    });
};

export const clearTasteCharacteristicsCache = () => {
    storage.remove(TASTE_CHARACTERISTICS_CACHE_KEY);
};

export const getWineSnackCuisinesCache = (wineId?: number | null) => {
    const payload = storage.get(WINE_SNACK_CUISINES_CACHE_KEY) as IWineSnackCuisinesCachePayload | null;

    if (!payload) {
        return null;
    }

    if (payload.wineId !== wineId) {
        return null;
    }

    return payload.values;
};

export const setWineSnackCuisinesCache = (
    wineId: number | null | undefined,
    values: IWineSnackCuisineCacheItem[],
) => {
    storage.set(WINE_SNACK_CUISINES_CACHE_KEY, {
        wineId,
        values,
    });
};

export const clearWineSnackCuisinesCache = () => {
    storage.remove(WINE_SNACK_CUISINES_CACHE_KEY);
};
