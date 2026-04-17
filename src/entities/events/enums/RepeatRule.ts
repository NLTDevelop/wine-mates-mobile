export enum RepeatRule {
    Never = 'never',
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
}

export const REPEAT_RULES = ['never', 'daily', 'weekly', 'monthly'] as const;
