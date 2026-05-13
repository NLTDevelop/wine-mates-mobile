import { useCallback, useRef } from 'react';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { wineModel } from '@/entities/wine/WineModel';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { EventTastingDraftData, IEventTastingDraftResponse } from '@/entities/events/types/IEventTastingDraft';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';

const createSuggestedItemName = (id: number) => `${id}`;
const DRAFT_ITEM_COLOR = colorTheme.colors.background;

const getAromaDraftItems = (ids?: number[]): IWineSelectedSmell[] => {
    if (!ids?.length) {
        return [];
    }

    return ids.map(id => ({
        id,
        colorHex: DRAFT_ITEM_COLOR,
        name: createSuggestedItemName(id),
    }));
};

const getSuggestedAromaDraftItems = (names?: string[]): IWineSelectedSmell[] => {
    if (!names?.length) {
        return [];
    }

    return names
        .filter(name => name.trim().length > 0)
        .map((name, index) => ({
            id: -(index + 1),
            colorHex: null,
            name,
        }));
};

const getFlavorDraftItems = (ids?: number[]): IWineTaste[] => {
    if (!ids?.length) {
        return [];
    }

    return ids.map(id => ({
        id,
        colorHex: DRAFT_ITEM_COLOR,
        name: createSuggestedItemName(id),
        sortNumber: 0,
    }));
};

const getSuggestedFlavorDraftItems = (names?: string[]): IWineTaste[] => {
    if (!names?.length) {
        return [];
    }

    return names
        .filter(name => name.trim().length > 0)
        .map((name, index) => ({
            id: -(index + 1),
            colorHex: null,
            name,
            sortNumber: 0,
        }));
};

export const useEventTastingDraft = () => {
    const currentEventTastingDraftRef = useRef<Partial<AddRateDto>>({});

    const getDefaultEventTastingDraft = useCallback((wineId: number): Partial<AddRateDto> => ({
        wineId,
        review: '',
        color: {
            colorId: 0,
            shadeId: 0,
            tone: '',
        },
        aromas: [],
        flavors: [],
        tasteCharacteristics: [],
    }), []);

    const getEventTastingDraftData = useCallback((
        responseData?: IEventTastingDraftResponse | EventTastingDraftData | null,
    ): EventTastingDraftData => {
        if (!responseData) {
            return {};
        }

        if ('data' in responseData && responseData.data) {
            return responseData.data;
        }

        return responseData as EventTastingDraftData;
    }, []);

    const applyWineDetailsToTastingModel = useCallback((wine: IWineDetails) => {
        wineModel.wine = {
            id: wine.id,
            name: wine.name,
            vintage: wine.vintage,
        };
        wineModel.base = {
            colorOfWine: {
                id: wine.color?.id ?? null,
                value: wine.color?.name ?? '',
            },
            country: {
                id: wine.country?.id ?? null,
                value: wine.country?.name ?? '',
            },
            region: {
                id: wine.region?.id ?? null,
                value: wine.region?.name ?? null,
            },
            producer: {
                id: null,
                value: wine.producer,
            },
            grapeVariety: {
                id: null,
                value: wine.grapeVariety,
            },
            vintageYear: {
                id: null,
                value: wine.vintage != null ? wine.vintage.toString() : '',
            },
            wineName: {
                id: null,
                value: wine.name,
            },
            typeOfWine: {
                id: wine.type?.id ?? null,
                value: wine.type?.name ?? '',
                isSparkling: wine.type?.isSparkling ?? false,
            },
        };
        wineModel.customVintage = null;
    }, []);

    const applyEventTastingDraftToModel = useCallback((draft: Partial<AddRateDto>, wineId: number) => {
        const nextDraft = {
            ...getDefaultEventTastingDraft(wineId),
            ...draft,
        };

        currentEventTastingDraftRef.current = nextDraft;
        wineModel.look = nextDraft.color?.colorId ? nextDraft.color : null;
        wineModel.review = {
            review: nextDraft.review || '',
            aiTastingNote: nextDraft.aiTastingNote || null,
            aiSnacks: nextDraft.aiSnacks || null,
        };
        wineModel.selectedSmells = [
            ...getSuggestedAromaDraftItems(nextDraft.suggestions?.aromas),
            ...getAromaDraftItems(nextDraft.aromas),
        ];
        wineModel.selectedTastes = [
            ...getSuggestedFlavorDraftItems(nextDraft.suggestions?.flavors),
            ...getFlavorDraftItems(nextDraft.flavors),
        ];
        wineModel.winePeak = typeof nextDraft.winePeak === 'number' ? nextDraft.winePeak : null;
    }, [getDefaultEventTastingDraft]);

    const buildEventTastingDraftPayload = useCallback((wineId: number): Partial<AddRateDto> => {
        const aromas = wineModel.selectedSmells
            ?.filter(item => item.colorHex)
            ?.map(item => item.id) || [];
        const suggestedAromas = wineModel.selectedSmells
            ?.filter(item => !item.colorHex)
            ?.map(item => item.name || '') || [];
        const flavors = wineModel.selectedTastes
            ?.filter(item => item.colorHex)
            ?.map(item => item.id) || [];
        const suggestedFlavors = wineModel.selectedTastes
            ?.filter(item => !item.colorHex)
            ?.map(item => item.name || '') || [];
        const tasteCharacteristics = wineModel.tasteCharacteristics?.map(item => {
            const selectedIndex = item.selectedIndex ?? 0;
            return {
                characteristicId: item.id,
                levelId: item.levels[selectedIndex]?.id || 0,
            };
        });

        const payload: Partial<AddRateDto> = {
            ...currentEventTastingDraftRef.current,
            wineId,
            review: wineModel.review?.review.trim() || '',
            color: {
                colorId: wineModel.look?.colorId || 0,
                shadeId: wineModel.look?.shadeId || 0,
                tone: wineModel.look?.tone || '',
            },
            aromas,
            flavors,
        };

        if (tasteCharacteristics) {
            payload.tasteCharacteristics = tasteCharacteristics;
        }

        if (wineModel.image) {
            payload.image = wineModel.image;
        }

        if (wineModel.winePeak !== null) {
            payload.winePeak = wineModel.winePeak;
        }

        if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
            const starRate = wineModel.review?.starRate ?? 0;
            if (typeof starRate === 'number' && !Number.isNaN(starRate)) {
                payload.userRating = Number(starRate.toFixed(1));
            }
        } else if (wineModel.review?.hasChangedRate && wineModel.review?.rate) {
            payload.expertRating = wineModel.review.rate;
        }

        if (wineModel.base?.typeOfWine.isSparkling && payload.color) {
            payload.color = {
                ...payload.color,
                mousse: wineModel.look?.mousse || 0,
                perlage: wineModel.look?.perlage || 0,
                appearance: wineModel.look?.appearance || 0,
            };
        }

        if (suggestedAromas.length > 0 || suggestedFlavors.length > 0) {
            payload.suggestions = {};

            if (suggestedAromas.length > 0) {
                payload.suggestions.aromas = suggestedAromas;
            }

            if (suggestedFlavors.length > 0) {
                payload.suggestions.flavors = suggestedFlavors;
            }
        }

        if (wineModel.review?.aiTastingNote) {
            payload.aiTastingNote = wineModel.review.aiTastingNote;
        }

        if (wineModel.review?.aiSnacks) {
            payload.aiSnacks = wineModel.review.aiSnacks;
        }

        currentEventTastingDraftRef.current = payload;

        return payload;
    }, []);

    return {
        applyEventTastingDraftToModel,
        applyWineDetailsToTastingModel,
        buildEventTastingDraftPayload,
        getDefaultEventTastingDraft,
        getEventTastingDraftData,
    };
};
