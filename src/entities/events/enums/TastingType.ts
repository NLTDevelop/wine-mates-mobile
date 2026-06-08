export enum TastingType {
    Regular = 'regular',
    Blind = 'blind',
}

export const TASTING_TYPES = [TastingType.Regular, TastingType.Blind] as const;
