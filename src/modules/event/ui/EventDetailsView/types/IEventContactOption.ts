export type EventContactType = 'instagram' | 'telegram' | 'facebook' | 'phone';

export interface IEventContactOption {
    id: number;
    type: EventContactType;
    title: string;
    phoneCountryCode: string;
    onPress: () => void;
}
