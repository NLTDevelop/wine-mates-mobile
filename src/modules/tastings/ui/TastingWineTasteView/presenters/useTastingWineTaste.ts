/* eslint-disable react-hooks/set-state-in-effect */
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineTasteGroup } from '@/entities/wine/types/IWineTatseGroup';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
}

const filterGroups = (groups: IWineTasteGroup[], selected: IWineTaste[]) =>
    groups.map(group => ({
        ...group,
        flavors: group.flavors.filter(flavor => !selected.some(selectedItem => selectedItem.id === flavor.id)),
    }));

const getResolvedSelectedTastes = (selectedItems: IWineTaste[], groups?: IWineTasteGroup[] | null): IWineTaste[] => {
    if (!groups?.length || !selectedItems.length) {
        return selectedItems;
    }

    const customSelectedItems = selectedItems.filter(item => !item.colorHex && item.id < 0);
    const regularSelectedItems = selectedItems.filter(item => item.colorHex || item.id >= 0);
    const resolvedRegularItems = regularSelectedItems.map(selectedItem => {
        if (!selectedItem.colorHex && selectedItem.id < 0) {
            return selectedItem;
        }

        for (const group of groups) {
            const flavor = group.flavors.find(item => item.id === selectedItem.id);
            if (flavor) {
                return flavor;
            }
        }

        return selectedItem;
    });

    return [...customSelectedItems, ...resolvedRegularItems];
};

export const useTastingWineTaste = (onHide?: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const isSelectedParametersVisible = !routeParams.isBlindTasting;
    const { buildEventTastingDraftPayload } = useEventTastingDraft();

    const initialSelected = wineModel.selectedTastes ?? [];
    const [isLoading, setIsLoading] = useState(() => !wineModel.tastes?.length);
    const [data, setData] = useState<IWineTasteGroup[]>(() => {
        if (!wineModel.tastes?.length) return [];
        return filterGroups(wineModel.tastes, initialSelected);
    });
    const [selected, setSelected] = useState<IWineTaste[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const initialDataRef = useRef<IWineTasteGroup[]>([]);
    const selectedRef = useRef<IWineTaste[]>(initialSelected);
    const initialData = wineModel.tastes;
    const [isSaving, setIsSaving] = useState(false);

    const getTastes = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id || !wineModel.base?.typeOfWine?.id) return;

            if (wineModel.tastes?.length) {
                const resolvedSelected = getResolvedSelectedTastes(selectedRef.current, wineModel.tastes);
                setSelected(resolvedSelected);
                wineModel.selectedTastes = resolvedSelected;
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base?.typeOfWine.id,
            };

            const response = await wineService.getTasteGroups(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                const resolvedSelected = getResolvedSelectedTastes(selectedRef.current, response.data);
                const nextData = filterGroups(response.data, resolvedSelected);
                setSelected(resolvedSelected);
                wineModel.selectedTastes = resolvedSelected;
                setData(nextData);
                initialDataRef.current = response.data;
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTastes();
    }, [getTastes]);

    useEffect(() => {
        const initial = initialData ?? [];
        initialDataRef.current = initial;
        setData(filterGroups(initial, selected));
    }, [initialData, selected]);

    useEffect(() => {
        wineModel.selectedTastes = selected;
    }, [selected]);

    useEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    const onItemPress = useCallback((item: IWineTaste, _subgroupId?: number | null, groupId?: number | null) => {
        setSelected(prevState => [item, ...prevState]);
        if (groupId) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== groupId) return group;
                    return {
                        ...group,
                        flavors: group.flavors.filter(flavor => flavor.id !== item.id),
                    };
                }),
            );
        }
        onHide?.();
        return item.id;
    }, [onHide]);

    const onSelectedItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => prevState.filter(taste => taste.id !== item.id));
        const originalGroup = initialDataRef.current.find(group => group.flavors.some(flavor => flavor.id === item.id));
        if (originalGroup) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== originalGroup.id) return group;
                    const hasFlavor = group.flavors.some(flavor => flavor.id === item.id);
                    const flavors = hasFlavor
                        ? group.flavors
                        : [...group.flavors, item].sort((a, b) => a.sortNumber - b.sortNumber);
                    return {
                        ...group,
                        flavors,
                    };
                }),
            );
        }
    }, []);

    const onAddCustomTaste = useCallback((text: string) => {
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        setSelected(prevState => [
            { 
                id: newId,
                colorHex: null,
                name: text,
                sortNumber: 1,
            },
            ...prevState,
        ]);
        return newId;
    }, []);

    const onPressNext = useCallback(async () => {
        wineModel.selectedTastes = selected;

        if (eventId && wineId) {
            setIsSaving(true);

            try {
                const response = await eventTastingService.saveDraft({
                    eventId,
                    wineId,
                    data: buildEventTastingDraftPayload(wineId),
                    isFinal: false,
                });

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            } catch (error) {
                console.error(JSON.stringify(error, null, 2));
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            } finally {
                setIsSaving(false);
            }

            navigation.navigate('TastingWineTasteCharacteristicsView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
            });
            return;
        }

        navigation.navigate('WineTasteCharacteristicsView', { source, wineId });
    }, [
        buildEventTastingDraftPayload,
        eventId,
        navigation,
        routeParams.isBlindTasting,
        selected,
        source,
        wineId,
    ]);

    return { 
        data,
        selected,
        isError,
        getTastes,
        isLoading,
        onItemPress,
        onAddCustomTaste,
        onSelectedItemPress,
        onPressNext,
        isSaving,
        isSelectedParametersVisible,
    };
};
