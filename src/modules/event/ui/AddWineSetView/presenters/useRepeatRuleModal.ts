import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { RepeatRule } from '@/entities/events/enums/RepeatRule';
import { RepeatRuleConfig } from '@/entities/events/types/RepeatRuleConfig';
import { RepeatRuleFrequency } from '@/entities/events/enums/RepeatRuleFrequency';
import { RepeatRuleEndConditionType } from '@/entities/events/enums/RepeatRuleEndConditionType';
import { IRepeatRuleModalItem } from '@/modules/event/types/IRepeatRuleModalItem';
import { getRepeatRuleDescription } from '@/modules/event/utils/repeatRuleFormatter';

interface IProps {
    value: RepeatRuleConfig | null;
    onChange: (value: RepeatRuleConfig | null) => void;
}

const REPEAT_RULE_LABEL_KEYS: Record<RepeatRule, string> = {
    [RepeatRule.Never]: 'event.repeatNever',
    [RepeatRule.Daily]: 'event.repeatDaily',
    [RepeatRule.Weekly]: 'event.repeatWeekly',
    [RepeatRule.Monthly]: 'event.repeatMonthly',
    [RepeatRule.Custom]: 'event.repeatCustom',
};

const REPEAT_RULE_MODAL_VALUES = [RepeatRule.Daily, RepeatRule.Weekly, RepeatRule.Monthly, RepeatRule.Custom];

const getRepeatRuleValue = (value: RepeatRuleConfig | null) => {
    if (!value) {
        return RepeatRule.Never;
    }

    const isDefaultEndCondition = value.endCondition.type === RepeatRuleEndConditionType.Never;
    const isDefaultInterval = value.interval === 1;
    const isHasWeekDays = !!value.weekDays?.length;

    if (!isDefaultEndCondition || !isDefaultInterval || isHasWeekDays) {
        return RepeatRule.Custom;
    }

    if (value.frequency === RepeatRuleFrequency.Day) {
        return RepeatRule.Daily;
    }

    if (value.frequency === RepeatRuleFrequency.Week) {
        return RepeatRule.Weekly;
    }

    if (value.frequency === RepeatRuleFrequency.Month) {
        return RepeatRule.Monthly;
    }

    return RepeatRule.Custom;
};

const getRepeatRuleDraftValue = (value: RepeatRule) => {
    if (value === RepeatRule.Never) {
        return RepeatRule.Daily;
    }

    return value;
};

const getRepeatRuleFrequency = (value: RepeatRule): RepeatRuleFrequency | null => {
    if (value === RepeatRule.Daily) {
        return RepeatRuleFrequency.Day;
    }

    if (value === RepeatRule.Weekly) {
        return RepeatRuleFrequency.Week;
    }

    if (value === RepeatRule.Monthly) {
        return RepeatRuleFrequency.Month;
    }

    return null;
};

const createRepeatRuleConfig = (value: RepeatRule): RepeatRuleConfig | null => {
    const frequency = getRepeatRuleFrequency(value);

    if (!frequency) {
        return null;
    }

    return {
        frequency,
        interval: 1,
        endCondition: {
            type: RepeatRuleEndConditionType.Never,
        },
    };
};

export const useRepeatRuleModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCustomRepeatVisible, setIsCustomRepeatVisible] = useState(false);
    const [isRepeatSwitchEnabled, setIsRepeatSwitchEnabled] = useState(false);

    const selectedValue = useMemo(() => {
        return getRepeatRuleValue(value);
    }, [value]);

    const isRepeatEnabled = useMemo(() => {
        return isRepeatSwitchEnabled || !!value;
    }, [isRepeatSwitchEnabled, value]);

    const [draft, setDraft] = useState<RepeatRule>(() => {
        return getRepeatRuleDraftValue(selectedValue);
    });

    const onOpen = useCallback(() => {
        if (!isRepeatEnabled) {
            return;
        }

        setDraft(getRepeatRuleDraftValue(selectedValue));
        setIsVisible(true);
    }, [isRepeatEnabled, selectedValue]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            if (draft === RepeatRule.Custom) {
                setIsCustomRepeatVisible(true);
                return;
            }

            const nextValue = createRepeatRuleConfig(draft);

            setIsRepeatSwitchEnabled(!!nextValue);
            onChange(nextValue);
        });
    }, [draft, onChange]);

    const createOnSelect = useCallback((nextValue: RepeatRule) => {
        return () => {
            setDraft(nextValue);
        };
    }, []);

    const onChangeSwitch = useCallback(
        (nextValue: boolean) => {
            setIsRepeatSwitchEnabled(nextValue);

            if (nextValue) {
                setDraft(getRepeatRuleDraftValue(selectedValue));
                return;
            }

            setIsVisible(false);
            onChange(null);
        },
        [onChange, selectedValue],
    );

    const onCloseCustomRepeat = useCallback(() => {
        setIsCustomRepeatVisible(false);
    }, []);

    const onConfirmCustomRepeat = useCallback(
        (nextValue: RepeatRuleConfig) => {
            setIsCustomRepeatVisible(false);
            setIsRepeatSwitchEnabled(true);
            onChange(nextValue);
        },
        [onChange],
    );

    const items = useMemo<IRepeatRuleModalItem[]>(() => {
        return REPEAT_RULE_MODAL_VALUES.map(ruleValue => {
            return {
                value: ruleValue,
                label: localization.t(REPEAT_RULE_LABEL_KEYS[ruleValue]),
                onPress: createOnSelect(ruleValue),
            };
        });
    }, [createOnSelect]);

    const selectedText = useMemo(() => {
        if (!value) {
            return localization.t('repeatEvent.chooseRecurrencePeriod');
        }

        if (selectedValue === RepeatRule.Custom) {
            return getRepeatRuleDescription(value);
        }

        return localization.t(REPEAT_RULE_LABEL_KEYS[selectedValue]);
    }, [selectedValue, value]);

    return {
        isVisible,
        draft,
        selectedText,
        items,
        isRepeatEnabled,
        onOpen,
        onClose,
        onConfirm,
        onChangeSwitch,
        isCustomRepeatVisible,
        onCloseCustomRepeat,
        onConfirmCustomRepeat,
    };
};
