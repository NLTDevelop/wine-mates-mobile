import { MobXRepository } from '@/repository/MobXRepository';
import { ITasteProfile } from '../types/ITasteProfile';
import { IWineListItem } from '../types/IWineListItem';

export interface IRecommendationPagination {
    page: number;
    totalPages: number;
}

export interface IWineAndStylesModel {
    tasteProfiles: ITasteProfile[];
    recommendations: Record<string, IWineListItem[]>;
    recommendationsPagination: Record<string, IRecommendationPagination>;
}

class WineAndStylesModel implements IWineAndStylesModel {
    private tasteProfilesRepository = new MobXRepository<ITasteProfile[]>([]);
    private recommendationsRepository = new MobXRepository<Record<string, IWineListItem[]>>({});
    private recommendationsPaginationRepository = new MobXRepository<Record<string, IRecommendationPagination>>({});

    public get tasteProfiles() {
        return this.tasteProfilesRepository.data ?? [];
    }

    public set tasteProfiles(value: ITasteProfile[]) {
        this.tasteProfilesRepository.save(value);
    }

    public get recommendations() {
        return this.recommendationsRepository.data ?? {};
    }

    public set recommendations(value: Record<string, IWineListItem[]>) {
        this.recommendationsRepository.save(value);
    }

    public get recommendationsPagination() {
        return this.recommendationsPaginationRepository.data ?? {};
    }

    public set recommendationsPagination(value: Record<string, IRecommendationPagination>) {
        this.recommendationsPaginationRepository.save(value);
    }
}

export const wineAndStylesModel = new WineAndStylesModel();
