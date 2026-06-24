export enum RepeatRule {
    Never = 'never',
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Custom = 'custom',
}

export const REPEAT_RULES = ['never', 'daily', 'weekly', 'monthly', 'custom'] as const;
