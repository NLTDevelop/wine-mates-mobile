export enum ParticipationCondition {
    FixedPrice = 'fixed_price',
    SplitBill = 'split_bill',
    Free = 'free',
    Charity = 'charity',
    Host = 'host',
    Guest = 'guest',
}

export const PARTICIPATION_CONDITIONS = [
    ParticipationCondition.FixedPrice,
    ParticipationCondition.SplitBill,
    ParticipationCondition.Free,
    ParticipationCondition.Charity,
    ParticipationCondition.Host,
    ParticipationCondition.Guest,
] as const;
