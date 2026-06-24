export const createMapLink = (latitude?: number | null, longitude?: number | null): string => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return '';
    }

    return `https://maps.google.com/?q=${latitude},${longitude}`;
};
