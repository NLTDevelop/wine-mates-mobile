const SYMBOL_BY_CURRENCY: Record<string, string> = {
    UAH: '₴',
    USD: '$',
    EUR: '€',
    GBP: '£',
    PLN: 'zł',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    TRY: '₺',
    RUB: '₽',
    CHF: '₣',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    AMD: '֏',
};

export const getCurrencySymbol = (currency?: string | null) => {
    const normalizedCurrency = (currency || '').trim().toUpperCase();

    return SYMBOL_BY_CURRENCY[normalizedCurrency] || ` ${normalizedCurrency}`;
};

export const formatEventPrice = (price?: number | string | null, currency?: string | null) => {
    const symbol = getCurrencySymbol(currency);
    const normalizedPrice = typeof price === 'string' ? price.trim() : price;

    if (normalizedPrice === undefined || normalizedPrice === null || normalizedPrice === '') {
        return symbol;
    }

    if (!symbol) {
        return `${normalizedPrice}`;
    }

    return `${normalizedPrice} ${symbol}`;
};
