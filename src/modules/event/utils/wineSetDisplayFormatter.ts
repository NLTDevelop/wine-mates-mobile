interface ILocalizedName {
    language?: string | null;
    value?: string | null;
}

interface INamedValue {
    name?: string | ILocalizedName[] | null;
}

interface IWineSetDisplayWine {
    id?: number | null;
    name?: string | null;
    producer?: string | null;
    vintage?: number | null;
    grapeVariety?: string | null;
    country?: string | INamedValue | null;
    region?: string | INamedValue | null;
    type?: INamedValue | null;
    color?: INamedValue | null;
}

const getLocalizedName = (value: ILocalizedName[], locale?: string) => {
    const normalizedLocale = (locale || '').toLowerCase().split(/[-_]/)[0];
    const matchedValue = value.find(item => item.language?.toLowerCase() === normalizedLocale)?.value;

    if (matchedValue?.trim()) {
        return matchedValue.trim();
    }

    const ukValue = value.find(item => item.language?.toLowerCase() === 'uk')?.value;
    if (ukValue?.trim()) {
        return ukValue.trim();
    }

    return value.find(item => item.value?.trim())?.value?.trim() || '';
};

const getWineSetText = (value?: string | INamedValue | null, locale?: string) => {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value.trim();
    }

    if (Array.isArray(value.name)) {
        return getLocalizedName(value.name, locale);
    }

    return value.name?.trim() || '';
};

export const getWineSetDisplayTitle = (wine: IWineSetDisplayWine) => {
    const name = wine.name?.trim();
    const vintage = wine.vintage ? ` ${wine.vintage}` : '';

    if (name) {
        return `${name}${vintage}`;
    }

    return wine.id ? `Wine #${wine.id}` : 'Wine';
};

export const getWineSetDisplaySubtitle = (wine: IWineSetDisplayWine, locale?: string) => {
    const parts = [
        wine.grapeVariety,
        wine.producer,
        wine.country,
        wine.region,
        wine.type,
        wine.color,
    ]
        .map(item => getWineSetText(item, locale))
        .filter(Boolean);

    return parts.join(' / ');
};
