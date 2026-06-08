import { RepeatRule } from '@/entities/events/enums/RepeatRule';

export interface IRepeatRuleModalItem {
    value: RepeatRule;
    label: string;
    onPress: () => void;
}
