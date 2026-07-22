import { IMedia } from "@/entities/media/types/IMedia";
import { WineryStatusEnum } from "../enums/WineryStatusEnum";

export interface IWinery {
    id: number;
    name: string;
    foundedYear: number;
    description: string;
    links: string[];
    createdAt: string;
    mainPhoto: IMedia | null;
    gallery: IMedia[];
    application: {
        id: number;
        status: WineryStatusEnum;
    };
    country: {
        id: number;
        name: string;
    };
    region: {
        id: number;
        name: string;
    };
}
