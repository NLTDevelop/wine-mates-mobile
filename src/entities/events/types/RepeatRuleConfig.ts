import { RepeatRuleFrequency } from '../enums/RepeatRuleFrequency';
import { RepeatRuleEndConditionType } from '../enums/RepeatRuleEndConditionType';

export type RepeatRuleEndCondition =
    | {
          type: RepeatRuleEndConditionType.Never;
      }
    | {
          type: RepeatRuleEndConditionType.Count;
          value: number;
      }
    | {
          type: RepeatRuleEndConditionType.Date;
          value: string;
      };

export interface RepeatRuleConfig {
    frequency: RepeatRuleFrequency;
    interval: number;
    weekDays?: number[];
    endCondition: RepeatRuleEndCondition;
}
