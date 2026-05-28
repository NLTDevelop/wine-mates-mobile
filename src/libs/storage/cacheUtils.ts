import { storage } from './MMKVStorage';

export const TASTE_CHARACTERISTICS_CACHE_KEY = 'wine_taste_characteristics_slider_values';

interface ITasteCharacteristicsCacheContext {
    wineId?: number | null;
    colorId?: number | null;
    typeId?: number | null;
}

interface ITasteCharacteristicsCachePayload {
    context: ITasteCharacteristicsCacheContext;
    values: Record<number, number>;
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
