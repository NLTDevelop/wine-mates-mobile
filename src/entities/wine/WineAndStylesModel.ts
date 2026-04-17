import { MobXRepository } from '@/repository/MobXRepository';
import { ITasteProfile } from './types/ITasteProfile';
import { IWineListItem } from './types/IWineListItem';

export interface IRecommendationPagination {
    page: number;
    totalPages: number;
}

export interface IWineAndStylesModel {
    tasteProfiles: ITasteProfile[];
    recommendations: Record<string, IWineListItem[]>;
    recommendationsPagination: Record<string, IRecommendationPagination>;
    setTasteProfiles: (value: ITasteProfile[]) => void;
    setRecommendations: (key: string, rows: IWineListItem[], page: number, totalPages: number) => void;
    appendRecommendations: (key: string, rows: IWineListItem[], page: number) => void;
    getRecommendationKey: (typeId: number, colorId: number) => string;
}

class WineAndStylesModel implements IWineAndStylesModel {
    private tasteProfilesRepository = new MobXRepository<ITasteProfile[]>([]);
    private recommendationsRepository = new MobXRepository<Record<string, IWineListItem[]>>({});
    private recommendationsPaginationRepository = new MobXRepository<Record<string, IRecommendationPagination>>({});

    public get tasteProfiles() {
        return this.tasteProfilesRepository.data ?? [];
    }

    public get recommendations() {
        return this.recommendationsRepository.data ?? {};
    }

    public get recommendationsPagination() {
        return this.recommendationsPaginationRepository.data ?? {};
    }

    public getRecommendationKey(typeId: number, colorId: number): string {
        return `${typeId}_${colorId}`;
    }

    public setTasteProfiles(value: ITasteProfile[]) {
        this.tasteProfilesRepository.save(value);
    }

    public setRecommendations(key: string, rows: IWineListItem[], page: number, totalPages: number) {
        const currentRows = this.recommendationsRepository.rawData ?? {};
        currentRows[key] = rows;
        this.recommendationsRepository.save({ ...currentRows });

        const currentPagination = this.recommendationsPaginationRepository.rawData ?? {};
        currentPagination[key] = { page, totalPages };
        this.recommendationsPaginationRepository.save({ ...currentPagination });
    }

    public appendRecommendations(key: string, rows: IWineListItem[], page: number) {
        const currentRows = this.recommendationsRepository.rawData ?? {};
        currentRows[key] = [...(currentRows[key] ?? []), ...rows];
        this.recommendationsRepository.save({ ...currentRows });

        const currentPagination = this.recommendationsPaginationRepository.rawData ?? {};
        if (currentPagination[key]) {
            currentPagination[key] = { ...currentPagination[key], page };
        }
        this.recommendationsPaginationRepository.save({ ...currentPagination });
    }
}

export const wineAndStylesModel = new WineAndStylesModel();
