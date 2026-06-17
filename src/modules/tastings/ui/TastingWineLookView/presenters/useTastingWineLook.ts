/* eslint-disable react-hooks/set-state-in-effect */
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { IWineLook } from '@/entities/wine/types/IWineLook';
import { wineService } from '@/entities/wine/services/WineService';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { wineModel } from '@/entities/wine/models/WineModel';
import { clearWineModel } from '@/entities/wine/services/WineModelService';
import { useSaveEventTastingDraftOnBlur } from '@/modules/tastings/presenters/useSaveEventTastingDraftOnBlur';

interface IUseWineLookArgs {
    t: (key: string, params?: Record<string, any> | undefined) => string;
    styles: ReturnType<typeof StyleSheet.create>;
}

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    tastingStatus?: WineSetTastingStatus;
    isBlindTasting?: boolean;
}

export const useTastingWineLook = ({ t, styles }: IUseWineLookArgs) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const {
        applyEventTastingDraftToModel,
        applyWineDetailsToTastingModel,
        buildEventTastingDraftPayload,
        getDefaultEventTastingDraft,
        getEventTastingDraftData,
    } = useEventTastingDraft();
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const tastingStatus = routeParams.tastingStatus ?? 'not_started';
    const isEditingFinishedTasting = tastingStatus === 'tasted';
    const isSelectedParametersVisible = !routeParams.isBlindTasting;
    const [isLoading, setIsLoading] = useState(true);
    const isSaving = false;
    const [perlage, setPerlage] = useState(0);
    const [appearance, setAppearance] = useState(0);
    const [mousse, setMousse] = useState(0);
    const [shade, setShade] = useState(2);
    const [selectedColor, setSelectedColor] = useState<IWineColorShade | null>(null);
    const [isError, setIsError] = useState(false);
    const [shadeSelectorKey, setShadeSelectorKey] = useState(0);
    const [shouldResetShadeKey, setShouldResetShadeKey] = useState(false);
    const currentColor = useMemo(() =>
        shade === 1 ? selectedColor?.tonePale : shade === 2 ? selectedColor?.toneMedium : selectedColor?.toneDeep,
    [shade, selectedColor]);
    const data = wineModel.colorsShades;

    const mapToneToShade = useCallback((tone?: string | null) => {
        if (tone === 'pale') return 1;
        if (tone === 'medium') return 2;
        if (tone === 'deep') return 3;
        return 2;
    }, []);

    const applyLookToState = useCallback((look?: IWineLook | null) => {
        if (!look) {
            setShade(2);
            setMousse(0);
            setPerlage(0);
            setAppearance(0);
            return;
        }

        setShade(mapToneToShade(look.tone));
        setMousse(look.mousse ?? 0);
        setPerlage(look.perlage ?? 0);
        setAppearance(look.appearance ?? 0);
    }, [mapToneToShade]);

    const getSelectedColorFromLook = useCallback((colors: IWineColorShade[]) => {
        const look = wineModel.look;
        if (!look) {
            return colors[0] || null;
        }

        return colors.find(item => item.id === look.shadeId) || colors[0] || null;
    }, []);

    const getColorsWithShades = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) {
                setIsLoading(false);
                return;
            }

            const cachedShades = wineModel.colorsShades;
            if (cachedShades?.length && cachedShades[0]?.colorId === wineModel.base.colorOfWine.id) {
                setSelectedColor(getSelectedColorFromLook(cachedShades));
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: String(wineModel.base.colorOfWine.id),
            };

            const response = await wineService.getColorsWithShades(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                }
                setIsError(true);
            } else {
                setSelectedColor(getSelectedColorFromLook(response.data));
                setIsError(false);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [getSelectedColorFromLook]);

    const loadEventTasting = useCallback(async () => {
        if (!eventId || !wineId) {
            await getColorsWithShades();
            return;
        }

        setIsLoading(true);
        setIsError(false);

        try {
            const wineResponse = await wineService.getById(wineId);

            if (wineResponse.isError || !wineResponse.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    wineResponse.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
                return;
            }

            clearWineModel();
            applyWineDetailsToTastingModel(wineResponse.data);

            if (tastingStatus === 'in_progress' || isEditingFinishedTasting) {
                const draftResponse = await eventTastingService.getDraft({ eventId, wineId });

                if (draftResponse.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        draftResponse.message || localization.t('common.somethingWentWrong'),
                    );
                    setIsError(true);
                    return;
                }

                applyEventTastingDraftToModel(getEventTastingDraftData(draftResponse.data), wineId);
                applyLookToState(wineModel.look);
            } else {
                applyEventTastingDraftToModel(getDefaultEventTastingDraft(wineId), wineId);
                applyLookToState(wineModel.look);
            }

            await getColorsWithShades();
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [
        applyEventTastingDraftToModel,
        applyLookToState,
        applyWineDetailsToTastingModel,
        eventId,
        getColorsWithShades,
        getDefaultEventTastingDraft,
        getEventTastingDraftData,
        isEditingFinishedTasting,
        tastingStatus,
        wineId,
    ]);

    useEffect(() => {
        loadEventTasting();
    }, [loadEventTasting]);

    useEffect(() => {
        if (selectedColor?.id != null) {
            setShouldResetShadeKey(true);
        }
    }, [selectedColor?.id]);

    useEffect(() => {
        applyLookToState(wineModel.look);
    }, [applyLookToState]);

    useEffect(() => {
        if (!data?.length) return;

        setSelectedColor(getSelectedColorFromLook(data));
    }, [data, getSelectedColorFromLook]);

    const getSparklingSliderData = useMemo(() => {
        const mousseLabels = [t('muse.none'), t('muse.moderate'), t('muse.creamy')];
        const perlageLabels = [t('perlage.large'), t('perlage.medium'), t('perlage.delicate')];
        const appearanceLabels = [t('wineView.cloudy'), t('wineView.translucent'), t('wineView.brilliant')];

        const generateSliderData = (labels: string[]) => labels.map((label, index) => ({ label, index: index * 2 }));

        return {
            mousseData: generateSliderData(mousseLabels),
            perlageData: generateSliderData(perlageLabels),
            appearanceData: generateSliderData(appearanceLabels),
        };
    }, [t]);

    const sliderDecorator = useCallback((item: ReactNode) => {
        return {
            item,
            count: 20,
            decoratorContainerStyle: styles.decoratorContainerStyle,
        };
    }, [styles]);

    const onSelectColor = useCallback((color: IWineColorShade) => {
        setSelectedColor(color);
        setShade(2);
    }, []);

    const onShadeAnimationEnd = useCallback(() => {
        if (!shouldResetShadeKey) return;
        setShadeSelectorKey(prev => prev + 1);
        setShouldResetShadeKey(false);
    }, [shouldResetShadeKey]);

    const saveLookToModel = useCallback(() => {
        if (!currentColor) return;

        if (wineModel.base?.typeOfWine.isSparkling) {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
                mousse,
                perlage,
                appearance,
                name: selectedColor?.name || '-',
            };
        } else {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
                name: selectedColor?.name || '-',
            };
        }
    }, [appearance, currentColor, mousse, perlage, selectedColor, shade]);

    useSaveEventTastingDraftOnBlur({
        eventId,
        wineId,
        buildPayload: buildEventTastingDraftPayload,
        isFinal: isEditingFinishedTasting,
        isEnabled: Boolean(currentColor),
        onBeforeSave: saveLookToModel,
    });

    const onPressNext = useCallback(() => {
        saveLookToModel();
        if (eventId && wineId) {
            navigation.navigate('TastingWineSmellView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
                tastingStatus,
            });
            return;
        }

        navigation.navigate('WineSmellView', { source, wineId });
    }, [
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveLookToModel,
        source,
        tastingStatus,
        wineId,
    ]);

    return {
        data,
        selectedColor,
        perlage,
        setPerlage,
        mousse,
        setMousse,
        shade,
        setShade,
        isError,
        getColorsWithShades,
        isLoading,
        isSaving,
        onSelectColor,
        onPressNext,
        appearance,
        setAppearance,
        shadeSelectorKey,
        onShadeAnimationEnd,
        sliderDecorator,
        getSparklingSliderData,
        currentColor,
        isSelectedParametersVisible,
    };
};
