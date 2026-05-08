import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { RepeatRule, REPEAT_RULES } from '@/entities/events/enums/RepeatRule';

interface IRepeatRuleModalItem {
    value: RepeatRule;
    label: string;
    onPress: () => void;
}

interface IProps {
    value: RepeatRule;
    onChange: (value: RepeatRule) => void;
}

const REPEAT_RULE_LABEL_KEYS: Record<RepeatRule, string> = {
    [RepeatRule.Never]: 'event.repeatNever',
    [RepeatRule.Daily]: 'event.repeatDaily',
    [RepeatRule.Weekly]: 'event.repeatWeekly',
    [RepeatRule.Monthly]: 'event.repeatMonthly',
};

export const useRepeatRuleModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<RepeatRule>(value);

    const onOpen = useCallback(() => {
        setDraft(value);
        setIsVisible(true);
    }, [value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const createOnSelect = useCallback((nextValue: RepeatRule) => {
        return () => {
            setDraft(nextValue);
        };
    }, []);

    const items = useMemo<IRepeatRuleModalItem[]>(() => {
        return REPEAT_RULES.map((currentValue) => {
            const ruleValue = currentValue as RepeatRule;

            return {
                value: ruleValue,
                label: localization.t(REPEAT_RULE_LABEL_KEYS[ruleValue]),
                onPress: createOnSelect(ruleValue),
            };
        });
    }, [createOnSelect]);

    const selectedText = useMemo(() => {
        return localization.t(REPEAT_RULE_LABEL_KEYS[value]);
    }, [value]);

    return {
        isVisible,
        draft,
        selectedText,
        items,
        onOpen,
        onClose,
        onConfirm,
    };
};
