import { IMedia } from '@/entities/media/types/IMedia';

export interface IWineListItem {
    createdAt: string;
    grapeVariety: string;
    id: number;
    image: IMedia;
    name: string;
    producer: string | null;
    userId: number;
    vintage: number;
}
