import { ContactType } from '@/entities/contacts/types/ContactType';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface IContactConfigItem {
    type: ContactType;
    keywords: string[];
    baseUrl: string;
}

const CONTACT_CONFIG: IContactConfigItem[] = [
    { type: 'instagram', keywords: ['instagram.com', 'instagram', '@instagram'], baseUrl: 'https://instagram.com/' },
    { type: 'telegram', keywords: ['t.me', 'telegram', '@telegram'], baseUrl: 'https://t.me/' },
    { type: 'facebook', keywords: ['facebook.com', 'fb.com', 'facebook'], baseUrl: 'https://facebook.com/' },
    { type: 'discord', keywords: ['discord.gg', 'discord.com', 'discord'], baseUrl: 'https://discord.com/' },
    { type: 'reddit', keywords: ['reddit.com', 'reddit'], baseUrl: 'https://reddit.com/' },
    { type: 'pinterest', keywords: ['pinterest.com', 'pinterest'], baseUrl: 'https://pinterest.com/' },
    { type: 'whatsapp', keywords: ['wa.me', 'whatsapp.com', 'whatsapp'], baseUrl: 'https://wa.me/' },
    { type: 'tiktok', keywords: ['tiktok.com', 'tiktok'], baseUrl: 'https://tiktok.com/@' },
    { type: 'threads', keywords: ['threads.net', 'threads'], baseUrl: 'https://threads.net/@' },
    { type: 'x', keywords: ['x.com', 'twitter.com', 'twitter', 'x '], baseUrl: 'https://x.com/' },
    { type: 'linkedin', keywords: ['linkedin.com', 'linkedin'], baseUrl: 'https://linkedin.com/in/' },
    { type: 'snapchat', keywords: ['snapchat.com', 'snapchat'], baseUrl: 'https://snapchat.com/add/' },
];

const getUrlPath = (value: string) => {
    const withoutProtocol = value
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
    const pathStartIndex = withoutProtocol.indexOf('/');

    if (pathStartIndex < 0) {
        return '';
    }

    return withoutProtocol.slice(pathStartIndex + 1);
};

const getQueryParam = (value: string, paramName: string) => {
    const queryStartIndex = value.indexOf('?');

    if (queryStartIndex < 0) {
        return '';
    }

    const query = value.slice(queryStartIndex + 1);
    const params = query.split('&');
    const foundParam = params.find((param) => param.startsWith(`${paramName}=`));

    if (!foundParam) {
        return '';
    }

    return decodeURIComponent(foundParam.replace(`${paramName}=`, ''));
};

const normalizeUsername = (value: string) => {
    const trimmed = value.trim();

    if (trimmed.startsWith('@')) {
        return trimmed.slice(1);
    }

    return trimmed;
};

const getContactConfig = (contactType: ContactType) => {
    return CONTACT_CONFIG.find((item) => item.type === contactType) || null;
};

export const getContactType = (name: string, value: string): ContactType => {
    const normalizedContact = `${name} ${value}`.toLowerCase();

    const matchedConfig = CONTACT_CONFIG.find((item) => {
        return item.keywords.some((keyword) => normalizedContact.includes(keyword));
    });

    if (matchedConfig) {
        return matchedConfig.type;
    }

    return 'phone';
};

export const getContactName = (value: string) => {
    const trimmedValue = value.trim();
    const type = getContactType('', trimmedValue);
    const contactConfig = getContactConfig(type);

    if (!contactConfig) {
        return trimmedValue;
    }

    return contactConfig.type.charAt(0).toUpperCase() + contactConfig.type.slice(1);
};

export const getContactUrl = (value: string, contactType: ContactType) => {
    const trimmedValue = value.trim();

    if (contactType === 'phone') {
        return `tel:${trimmedValue.replace(/[^+0-9]/g, '')}`;
    }

    if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
        return trimmedValue;
    }

    const normalizedUsername = normalizeUsername(trimmedValue);
    const contactConfig = getContactConfig(contactType);

    if (trimmedValue.includes('.')) {
        return `https://${trimmedValue}`;
    }

    if (contactConfig) {
        return `${contactConfig.baseUrl}${normalizedUsername}`;
    }

    return trimmedValue;
};

export const getContactTitle = (name: string, value: string, contactType: ContactType) => {
    if (contactType === 'phone') {
        return value;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.startsWith('@')) {
        return trimmedValue.slice(1);
    }

    if (!trimmedValue.includes('/') && !trimmedValue.includes('.')) {
        return trimmedValue;
    }

    const urlPath = getUrlPath(trimmedValue);

    if (urlPath) {
        const pathWithoutQuery = urlPath.split('?')[0];
        const pathParts = pathWithoutQuery.split('/').filter(Boolean);
        const firstPathPart = pathParts[0];
        const secondPathPart = pathParts[1];

        if (firstPathPart === 'profile.php') {
            return getQueryParam(trimmedValue, 'id') || name;
        }

        if (firstPathPart) {
            if (firstPathPart === 's' && secondPathPart) {
                return secondPathPart;
            }

            return firstPathPart;
        }
    }

    return name;
};

export const isValidContactValue = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return false;
    }

    const contactType = getContactType('', trimmedValue);

    if (contactType !== 'phone') {
        return true;
    }

    const phoneNumber = parsePhoneNumberFromString(trimmedValue);

    return Boolean(phoneNumber?.isValid());
};
