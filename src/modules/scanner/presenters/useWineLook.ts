import { IWineColorShade } from "@/entities/wine/types/IWineColorShade";
import { wineModel } from "@/entities/wine/WineModel";
import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWineLook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(true);
    const [perlage, setPerlage] = useState(0);
    const [appearance, setAppearance] = useState(0);
    const [mousse, setMousse] = useState(0);
    const [shade, setShade] = useState(2);
    const [selectedColor, setSelectedColor] = useState<IWineColorShade | null>(null);
    const [isError, setIsError] = useState(false);
    const currentColor = useMemo(() =>
        shade === 1 ? selectedColor?.tonePale : shade === 2 ? selectedColor?.toneMedium : selectedColor?.toneDeep,
    [shade, selectedColor]);
    const data = wineModel.colorsShades;

    const getColorsWithShades = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

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
        return () => wineModel.clear();;
    }, []);

    const onSelectColor = useCallback((color: IWineColorShade) => {
        setSelectedColor(color);
        setShade(2);
    }, []);

    const handlePressNext = useCallback(() => {
        if (!currentColor) return;

        if (wineModel.base?.typeOfWine.isSparkling) {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
                mousse,
                perlage,
                appearance,
            }
        } else {
            wineModel.look = {
                colorId: selectedColor?.colorId || 1,
                shadeId: selectedColor?.id || 1,
                tone: shade === 1 ? 'pale' : shade === 2 ? 'medium' : 'deep',
            }
        }
        navigation.navigate('WineSmellView');
    }, [navigation, currentColor, mousse, perlage, appearance, selectedColor, shade]);
    
    return { 
        data, selectedColor, perlage, setPerlage, mousse, setMousse, shade, setShade, isError, getColorsWithShades, currentColor,
        isLoading, onSelectColor, handlePressNext, appearance, setAppearance
    };
};
