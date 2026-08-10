interface ILocalizedName {
    language?: string | null;
    value?: string | null;
}

interface INamedValue {
    name?: string | ILocalizedName[] | null;
}

interface IWineDisplayItem {
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

const getWineText = (value?: string | INamedValue | null, locale?: string) => {
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

export const getWineDisplayTitle = (wine: IWineDisplayItem) => {
    const producer = wine.producer?.trim();

    if (producer) {
        return producer;
    }

    return wine.id ? `Wine #${wine.id}` : 'Wine';
};

export const getWineDisplaySubtitle = (wine: IWineDisplayItem, locale?: string, showVintage = true) => {
    const parts = [
        wine.grapeVariety,
        wine.name,
        wine.type,
        wine.color,
        wine.country,
        wine.region,
        showVintage ? wine.vintage?.toString() : null,
    ]
        .map(item => getWineText(item, locale))
        .filter(Boolean);

    return parts.join(' / ');
};
