import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useAddWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState({
        winery: '',
        grapeVariety: '',
        vintageYear: '',
        wineName: '',
    });
    const isDisabled = useMemo(() => {
        const baseRequired = [form.winery, form.grapeVariety, form.vintageYear, form.wineName];
        const hasEmptyBase = baseRequired.some(field => !field.trim());

        return hasEmptyBase;
    }, [form]);

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
        navigation.navigate('WineLookView');
    }, [navigation]);

    return { 
        form, onChangeWinery, onChangeGrapeVariety, onChangeVintageYear, onChangeWineName, handleNextPress, isDisabled
    };
};
