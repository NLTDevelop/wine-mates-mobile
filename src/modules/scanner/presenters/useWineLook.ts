import { IWineColorShade } from "@/entities/wine/types/IWineColorShade";
import { wineModel } from "@/entities/wine/WineModel";
import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

interface IUseWineLookArgs {
    t: (key: string, params?: Record<string, any> | undefined) => string;
    styles: ReturnType<typeof StyleSheet.create>;
}

export const useWineLook = ({t, styles}: IUseWineLookArgs) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(() => !wineModel.colorsShades?.length);
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

    const getColorsWithShades = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            const cachedShades = wineModel.colorsShades;
            if (cachedShades?.length && cachedShades[0]?.colorId === wineModel.base.colorOfWine.id) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: String(wineModel.base?.colorOfWine.id),
            };

            const response = await wineService.getColorsWithShades(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setSelectedColor(response.data[0]);
                setIsError(false);
            }
        } catch(error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getColorsWithShades();
    }, [getColorsWithShades]);

    useEffect(() => {
        if (selectedColor?.id != null) {
            setShouldResetShadeKey(true);
        }
    }, [selectedColor?.id]);

    useEffect(() => {
        const look = wineModel.look;
        if (!look) return;

        setShade(mapToneToShade(look.tone));
        setMousse(look.mousse ?? 0);
        setPerlage(look.perlage ?? 0);
        setAppearance(look.appearance ?? 0);
    }, [mapToneToShade]);

    useEffect(() => {
        if (!data?.length) return;

        const look = wineModel.look;
        const shadeFromLook = look ? data.find(item => item.id === look.shadeId) : null;
        if (shadeFromLook) {
            setSelectedColor(shadeFromLook);
            return;
        }

        setSelectedColor(prev => prev ?? data[0]);
    }, [data]);

    const getSparklingSliderData = useMemo(() => {
        const mousseLabels = [t('muse.missing'), t('muse.creamy'), t('muse.moderate')];
        const perlageLabels = [t('perlage.coarse'), t('perlage.thin'), t('perlage.small')];
        const appearanceLabels = [t('wineView.cloudy'), t('wineView.sparklingClean'), t('wineView.translucent')];

        const generateSliderData = (labels: string[]) => labels.map((label, index) => ({ label, index: index * 2 }));

        return {
            mousseData: generateSliderData(mousseLabels),
            perlageData: generateSliderData(perlageLabels),
            appearanceData: generateSliderData(appearanceLabels),
        };
    }, [t])

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

    const handleShadeAnimationEnd = useCallback(() => {
        if (!shouldResetShadeKey) return;
        setShadeSelectorKey(prev => prev + 1);
        setShouldResetShadeKey(false);
    }, [shouldResetShadeKey]);

    const handlePressNext = useCallback(() => {
        if (!currentColor) return;
        console.log(selectedColor)

        if (wineModel.base?.typeOfWine.isSparkling) {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
                mousse,
                perlage,
                appearance,
                name: selectedColor?.name || '-',
            }
        } else {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
                name: selectedColor?.name || '-',
            }
        }
        navigation.navigate('WineSmellView');
    }, [navigation, currentColor, mousse, perlage, appearance, selectedColor, shade]);

    return {
        data, selectedColor, perlage, setPerlage, mousse, setMousse, shade, setShade, isError, getColorsWithShades, currentColor,
        isLoading, onSelectColor, handlePressNext, appearance, setAppearance, shadeSelectorKey, handleShadeAnimationEnd, sliderDecorator, getSparklingSliderData
    };
};
