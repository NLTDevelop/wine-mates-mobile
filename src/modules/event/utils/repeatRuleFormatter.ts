import { format, isValid, parseISO } from 'date-fns';
import { localization } from '@/UIProvider/localization/Localization';
import { RepeatRuleConfig, RepeatRuleEndCondition } from '@/entities/events/types/RepeatRuleConfig';
import { RepeatRuleFrequency } from '@/entities/events/enums/RepeatRuleFrequency';
import { RepeatRuleEndConditionType } from '@/entities/events/enums/RepeatRuleEndConditionType';

const REPEAT_RULE_FREQUENCY_LABEL_KEYS: Record<RepeatRuleFrequency, string> = {
    [RepeatRuleFrequency.Day]: 'repeatEvent.everyDay',
    [RepeatRuleFrequency.Week]: 'repeatEvent.everyWeek',
    [RepeatRuleFrequency.Month]: 'repeatEvent.everyMonth',
    [RepeatRuleFrequency.Year]: 'repeatEvent.everyYear',
};

const REPEAT_RULE_FREQUENCY_UNIT_LABEL_KEYS: Record<RepeatRuleFrequency, string> = {
    [RepeatRuleFrequency.Day]: 'repeatEvent.days',
    [RepeatRuleFrequency.Week]: 'repeatEvent.weeks',
    [RepeatRuleFrequency.Month]: 'repeatEvent.months',
    [RepeatRuleFrequency.Year]: 'repeatEvent.years',
};

const WEEK_DAY_LABEL_KEYS: Record<number, string> = {
    0: 'repeatEvent.sun',
    1: 'repeatEvent.mon',
    2: 'repeatEvent.tue',
    3: 'repeatEvent.wed',
    4: 'repeatEvent.thu',
    5: 'repeatEvent.fri',
    6: 'repeatEvent.sat',
};

const getFormattedEndDate = (value: string) => {
    const date = parseISO(value);

    if (!isValid(date)) {
        return value;
    }

    return format(date, 'dd/MM/yyyy');
};

const getRepeatRuleEndConditionDescription = (endCondition: RepeatRuleEndCondition) => {
    if (endCondition.type === RepeatRuleEndConditionType.Date) {
        return localization.t('repeatEvent.untilDate', {
            date: getFormattedEndDate(endCondition.value),
        });
    }

    if (endCondition.type === RepeatRuleEndConditionType.Count) {
        return localization.t('repeatEvent.repetitionCount', {
            count: endCondition.value,
        });
    }

    return '';
};

export const getRepeatRuleDescription = (value: RepeatRuleConfig) => {
    const baseText =
        value.interval === 1
            ? localization.t(REPEAT_RULE_FREQUENCY_LABEL_KEYS[value.frequency])
            : localization.t('repeatEvent.everyInterval', {
                  interval: value.interval,
                  unit: localization.t(REPEAT_RULE_FREQUENCY_UNIT_LABEL_KEYS[value.frequency]),
              });
    const parts = [baseText];

    if (value.frequency === RepeatRuleFrequency.Week && value.weekDays?.length) {
        const weekDaysText = value.weekDays
            .map(day => localization.t(WEEK_DAY_LABEL_KEYS[day]))
            .filter(Boolean)
            .join(', ');

        parts.push(localization.t('repeatEvent.onWeekDays', { days: weekDaysText }));
    }

    const endConditionText = getRepeatRuleEndConditionDescription(value.endCondition);

    if (endConditionText) {
        parts.push(endConditionText);
    }

    return parts.join(', ');
};
