import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineModel } from '@/entities/wine/WineModel';

export const useAddWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState({
        typeOfWine: '',
        colorOfWine: '',
        country: '',
        region: '',
        winery: '',
        grapeVariety: '',
        vintageYear: '',
        wineName: '',
    });
    const isDisabled = useMemo(() => {
        const baseRequired = [
            form.typeOfWine,
            form.colorOfWine,
            form.country,
            form.region,
            form.winery,
            form.grapeVariety,
            form.vintageYear,
            form.wineName,
        ];
        const hasEmptyBase = baseRequired.some(field => !field.trim());

        return hasEmptyBase;
    }, [form]);

    const onChangeType= useCallback((value: string) => {
        setForm(prev => ({ ...prev, typeOfWine: value || '' }));
    }, []);

    const onChangeColor= useCallback((value: string) => {
        setForm(prev => ({ ...prev, colorOfWine: value || '' }));
    }, []);

    const onChangeCountry= useCallback((value: string) => {
        setForm(prev => ({ ...prev, country: value || '' }));
    }, []);

    const onChangeRegion= useCallback((value: string) => {
        setForm(prev => ({ ...prev, region: value || '' }));
    }, []);

    const onChangeWinery= useCallback((value: string) => {
        setForm(prev => ({ ...prev, winery: value || '' }));
    }, []);

    const onChangeGrapeVariety = useCallback((value: string) => {
        setForm(prev => ({ ...prev, grapeVariety: value || '' }));
    }, []);

    const onChangeVintageYear = useCallback((value: string) => {
        setForm(prev => ({ ...prev, vintageYear: value || '' }));
    }, []);

    const onChangeWineName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineName: value || '' }));
    }, []);

    const handleNextPress = useCallback(async () => {
        wineModel.base = form;
        navigation.navigate('WineLookView');
    }, [navigation, form]);

    return { 
        form, onChangeWinery, onChangeGrapeVariety, onChangeVintageYear, onChangeWineName, handleNextPress, isDisabled,
        onChangeType, onChangeColor, onChangeCountry, onChangeRegion
    };
};
