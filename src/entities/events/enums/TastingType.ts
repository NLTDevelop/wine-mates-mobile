export enum TastingType {
    Blind = 'blind',
    Regular = 'regular',
}

export const TASTING_TYPES = [TastingType.Blind, TastingType.Regular] as const;
