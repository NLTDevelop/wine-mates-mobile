import { storage } from './MMKVStorage';

export const TASTE_CHARACTERISTICS_CACHE_KEY = 'wine_taste_characteristics_slider_values';

export const clearTasteCharacteristicsCache = () => {
    storage.remove(TASTE_CHARACTERISTICS_CACHE_KEY);
};
