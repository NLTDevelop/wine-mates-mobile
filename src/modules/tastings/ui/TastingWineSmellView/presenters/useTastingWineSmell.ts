import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IAroma, ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { wineService } from '@/entities/wine/services/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { wineModel } from '@/entities/wine/models/WineModel';
import { WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { useSaveEventTastingDraftOnBlur } from '@/modules/tastings/presenters/useSaveEventTastingDraftOnBlur';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
    tastingStatus?: WineSetTastingStatus;
}

const getResolvedSelectedSmells = (
    selectedItems: IWineSelectedSmell[],
    groups?: IWineSmell[] | null,
): IWineSelectedSmell[] => {
    if (!groups?.length || !selectedItems.length) {
        return selectedItems;
    }

    return selectedItems.map(selectedItem => {
        if (!selectedItem.colorHex && selectedItem.id < 0) {
            return selectedItem;
        }

        for (const group of groups) {
            for (const subgroup of group.subgroups) {
                const aroma = subgroup.aromas.find(item => item.id === selectedItem.id);
                if (aroma) {
                    return {
                        id: aroma.id,
                        colorHex: aroma.colorHex,
                        name: aroma.name,
                        subgroupId: subgroup.id,
                        groupId: group.id,
                        aroma,
                    };
                }

                if (subgroup.hiddenItemId === selectedItem.id) {
                    const hiddenAroma: IAroma = {
                        id: subgroup.hiddenItemId,
                        colorHex: subgroup.colorHex,
                        name: subgroup.name,
                        sortNumber: subgroup.sortNumber,
                    };

                    return {
                        id: hiddenAroma.id,
                        colorHex: hiddenAroma.colorHex,
                        name: hiddenAroma.name,
                        subgroupId: subgroup.id,
                        groupId: group.id,
                        aroma: hiddenAroma,
                        isHiddenSubgroupItem: true,
                    };
                }
            }
        }

        return selectedItem;
    });
};

export const useTastingWineSmell = (onHide: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const tastingStatus = routeParams.tastingStatus ?? 'not_started';
    const isEditingFinishedTasting = tastingStatus === 'tasted';
    const isSelectedParametersVisible = !routeParams.isBlindTasting;
    const { buildEventTastingDraftPayload } = useEventTastingDraft();

    const colorId = wineModel.base?.colorOfWine?.id ?? null;
    const typeId = wineModel.base?.typeOfWine?.id ?? null;
    const hasSmells = Boolean(wineModel.smells?.length);

    const initialSelected = wineModel.selectedSmells ?? [];
    const [isLoading, setIsLoading] = useState(() => !hasSmells || !colorId || !typeId);
    const [isOpened, setIsOpened] = useState(false);
    const [selectedIndex, setSelectedIndex] =  useState(0);
    const [selected, setSelected] = useState<IWineSelectedSmell[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const isSaving = false;
    const selectedRef = useRef<IWineSelectedSmell[]>(initialSelected);
    const data: IWineSmell[] = (() => {
        if (!wineModel.smells?.length) {
            return [];
        }

        return wineModel.smells.map(group => ({
            ...group,
            subgroups: group.subgroups.map(subgroup => ({
                ...subgroup,
                aromas: subgroup.aromas.filter(
                    aroma => !selected.some(selectedItem => selectedItem.id === aroma.id),
                ),
            })),
        }));
    })();

    const visibleSubgroups = useMemo(() => {
        const currentGroup = data[selectedIndex];
        if (!currentGroup) return [];
        return currentGroup.subgroups.filter(subgroup => {
            if (!subgroup.hiddenItemId) {
                return true;
            }

            const isHiddenSelected = selected.some(item => item.id === subgroup.hiddenItemId);
            return !isHiddenSelected;
        });
    }, [data, selected, selectedIndex]);

    const getSmells = useCallback(async () => {
        try {
            if (!colorId || !typeId) {
                setIsLoading(true);
                return;
            }

            if (wineModel.smells?.length) {
                const resolvedSelected = getResolvedSelectedSmells(selectedRef.current, wineModel.smells);
                setSelected(resolvedSelected);
                wineModel.selectedSmells = resolvedSelected;
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId,
                typeId,
            };

            const response = await wineService.getSmells(params);

            if (response.isError || response.data === null || response.data === undefined) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                const resolvedSelected = getResolvedSelectedSmells(selectedRef.current, response.data);
                setSelected(resolvedSelected);
                wineModel.selectedSmells = resolvedSelected;
                setIsError(false);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, [colorId, typeId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getSmells();
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [getSmells]);

    useEffect(() => {
        wineModel.selectedSmells = selected.map(item => item);
        selectedRef.current = selected;
    }, [selected]);

    const onItemPress = useCallback((item: IAroma, subgroupId?: number | null, groupId?: number | null) => {
        const addedSmell: IWineSelectedSmell = {
            id: item.id,
            colorHex: item.colorHex,
            name: item.name,
            subgroupId,
            groupId,
            aroma: item,
        };
        setSelected(prevState => {
            if (prevState.some(selectedItem => selectedItem.id === item.id)) {
                return prevState;
            }

            return [addedSmell, ...prevState];
        });
        onHide();
        Keyboard.dismiss();
        return item.id;
    }, [onHide]);

    const onSubgroupPress = useCallback((subgroup: ISmellSubgroup, groupId: number) => {
        if (subgroup.aromas.length > 0) {
            return false;
        }

        if (!subgroup.hiddenItemId) {
            return true;
        }

        const hiddenAroma: IAroma = {
            id: subgroup.hiddenItemId,
            colorHex: subgroup.colorHex,
            name: subgroup.name,
            sortNumber: subgroup.sortNumber,
        };

        const addedSmell: IWineSelectedSmell = {
            id: hiddenAroma.id,
            colorHex: hiddenAroma.colorHex,
            name: hiddenAroma.name,
            subgroupId: subgroup.id,
            groupId,
            aroma: hiddenAroma,
            isHiddenSubgroupItem: true,
        };

        setSelected(prevState => {
            if (prevState.some(item => item.id === addedSmell.id)) {
                return prevState;
            }

            return [addedSmell, ...prevState];
        });

        Keyboard.dismiss();
        return true;
    }, []);

    const onSelectedItemPress = useCallback((item: IWineSelectedSmell) => {
        setSelected(prevState => prevState.filter(smell => smell.id !== item.id));
        Keyboard.dismiss();
    }, []);

    const toggleList = useCallback(() => {
        setIsOpened(prevState => !prevState);
        Keyboard.dismiss();
    }, []);

    const onGroupPress = useCallback((groupId: number) => {
        const nextIndex = data.findIndex(group => group.id === groupId);
        if (nextIndex === -1) return;
        setSelectedIndex(nextIndex);
        setIsOpened(true);
        Keyboard.dismiss();
    }, [data]);

    const onLeftPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === 0 ? data.length - 1 : prevState - 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const onRightPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === data.length - 1 ? 0 : prevState + 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const onAddCustomSmell = useCallback((text: string) => {
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        setSelected(prevState => [
            { 
                id: newId,
                colorHex: null,
                name: text,
            },
            ...prevState,
        ]);
        Keyboard.dismiss();
        return newId;
    }, []);

    const saveSelectedSmellsToModel = useCallback(() => {
        wineModel.selectedSmells = selected;
    }, [selected]);

    useSaveEventTastingDraftOnBlur({
        eventId,
        wineId,
        buildPayload: buildEventTastingDraftPayload,
        isFinal: isEditingFinishedTasting,
        onBeforeSave: saveSelectedSmellsToModel,
    });

    const onNextPress = useCallback(() => {
        saveSelectedSmellsToModel();
        if (eventId && wineId) {
            navigation.navigate('TastingWineTasteView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
                tastingStatus,
            });
            Keyboard.dismiss();
            return;
        }

        navigation.navigate('WineTasteView', { source, wineId });
        Keyboard.dismiss();
    }, [
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveSelectedSmellsToModel,
        source,
        tastingStatus,
        wineId,
    ]);

    return { 
        data, selected, isError, getSmells, isLoading, isOpened, onItemPress, toggleList, selectedIndex,
        onLeftPress, onRightPress, onAddCustomSmell, onSelectedItemPress, onNextPress, visibleSubgroups,
        onGroupPress, onSubgroupPress, isSaving, isSelectedParametersVisible,
    };
};
