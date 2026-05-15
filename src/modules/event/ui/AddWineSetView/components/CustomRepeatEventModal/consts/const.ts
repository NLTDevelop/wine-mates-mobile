import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { RepeatRuleFrequency } from '@/entities/events/enums/RepeatRuleFrequency';

const INTERVAL_ITEMS_COUNT = 10;

export const INTERVAL_ITEMS: IDropdownItem[] = Array.from({ length: INTERVAL_ITEMS_COUNT }, (_, index) => {
    const value = index + 1;

    return {
        label: String(value),
        value,
    };
});

export const FREQUENCY_ITEMS: IDropdownItem[] = [
    {
        label: localization.t('repeatEvent.day'),
        value: RepeatRuleFrequency.Day,
    },
    {
        label: localization.t('repeatEvent.week'),
        value: RepeatRuleFrequency.Week,
    },
    {
        label: localization.t('repeatEvent.month'),
        value: RepeatRuleFrequency.Month,
    },
    {
        label: localization.t('repeatEvent.year'),
        value: RepeatRuleFrequency.Year,
    },
];

export const REPETITION_COUNT_ITEMS: IDropdownItem[] = Array.from({ length: INTERVAL_ITEMS_COUNT }, (_, index) => {
    const value = index + 1;

    return {
        label: `${value} ${localization.t('repeatEvent.repetition').toLowerCase()}`,
        value,
    };
});

export const WEEK_DAY_ITEMS = [
    {
        label: localization.t('repeatEvent.sun'),
        value: 0,
    },
    {
        label: localization.t('repeatEvent.mon'),
        value: 1,
    },
    {
        label: localization.t('repeatEvent.tue'),
        value: 2,
    },
    {
        label: localization.t('repeatEvent.wed'),
        value: 3,
    },
    {
        label: localization.t('repeatEvent.thu'),
        value: 4,
    },
    {
        label: localization.t('repeatEvent.fri'),
        value: 5,
    },
    {
        label: localization.t('repeatEvent.sat'),
        value: 6,
    },
];
