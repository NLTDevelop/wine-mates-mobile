import { IMedia } from '@/entities/media/types/IMedia';

export interface IWineSetSearchItem {
    id: number;
    name: string;
    producer?: string | null;
    vintage?: number | null;
    grapeVariety?: string | null;
    country?: string | { name?: string | null } | null;
    region?: string | { name?: string | null } | null;
    image?: IMedia | null;
}
