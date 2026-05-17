import { ParticipationCondition } from '../enums/ParticipationCondition';

export type PriceInputParticipationCondition =
    | ParticipationCondition.FixedPrice
    | ParticipationCondition.SplitBill
    | ParticipationCondition.Charity;
