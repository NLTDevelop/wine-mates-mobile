import { useCallback, useEffect, useMemo, useState } from 'react';
import { ICountry } from '@/entities/wine/types/ICountry';
import { wineService } from '@/entities/wine/services/WineService';
import { userService } from '@/entities/users/UserService';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

const areCountryIdsEqual = (first: number[], second: number[]) => {
    if (first.length !== second.length) {
        return false;
    }

    const sortedFirst = [...first].sort((left, right) => left - right);
    const sortedSecond = [...second].sort((left, right) => left - right);

    return sortedFirst.every((value, index) => value === sortedSecond[index]);
};

export const useSellerCountriesPicker = () => {
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);
    const [draftCountryIds, setDraftCountryIds] = useState<number[]>([]);
    const [initialCountryIds, setInitialCountryIds] = useState<number[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadError, setIsLoadError] = useState(false);

    const onLoad = useCallback(async () => {
        setIsLoading(true);
        setIsLoadError(false);

        try {
            const [countriesResponse, selectedCountriesResponse] = await Promise.all([
                wineService.getCountries(),
                userService.getSellerCountries(),
            ]);

            if (
                countriesResponse.isError ||
                !countriesResponse.data ||
                selectedCountriesResponse.isError ||
                !selectedCountriesResponse.data
            ) {
                setIsLoadError(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    countriesResponse.message ||
                        selectedCountriesResponse.message ||
                        localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const nextCountryIds = selectedCountriesResponse.data.map(item => item.countryId);
            setCountries(countriesResponse.data);
            setSelectedCountryIds(nextCountryIds);
            setDraftCountryIds(nextCountryIds);
            setInitialCountryIds(nextCountryIds);
        } catch (error) {
            console.error('useSellerCountriesPicker -> onLoad: ', error);
            setIsLoadError(true);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onLoad();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [onLoad]);

    const onOpen = useCallback(() => {
        if (isLoading || isLoadError) {
            return;
        }

        setDraftCountryIds(selectedCountryIds);
        setIsVisible(true);
    }, [isLoadError, isLoading, selectedCountryIds]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const createOnToggle = useCallback((countryId: number) => {
        return () => {
            setDraftCountryIds(currentIds => {
                if (currentIds.includes(countryId)) {
                    return currentIds.filter(id => id !== countryId);
                }

                return [...currentIds, countryId];
            });
        };
    }, []);

    const options = useMemo<IUniversalPickerOption[]>(() => {
        return countries.map(country => ({
            id: String(country.id),
            title: country.name,
            isSelected: draftCountryIds.includes(country.id),
            onPress: createOnToggle(country.id),
        }));
    }, [countries, createOnToggle, draftCountryIds]);

    const selectedText = useMemo(() => {
        return countries
            .filter(country => selectedCountryIds.includes(country.id))
            .map(country => country.name)
            .join(', ');
    }, [countries, selectedCountryIds]);

    const onConfirm = useCallback(() => {
        setSelectedCountryIds(draftCountryIds);
        setIsVisible(false);
    }, [draftCountryIds]);

    const hasChanges = useMemo(() => {
        return !areCountryIdsEqual(initialCountryIds, selectedCountryIds);
    }, [initialCountryIds, selectedCountryIds]);

    const onSave = useCallback(async () => {
        if (!hasChanges) {
            return true;
        }

        const response = await userService.updateSellerCountries(selectedCountryIds);

        if (response.isError) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
            return false;
        }

        setInitialCountryIds(selectedCountryIds);
        return true;
    }, [hasChanges, selectedCountryIds]);

    return {
        title: localization.t('settings.sellerCountries'),
        selectedText,
        options,
        isVisible,
        isLoading,
        isDisabled: isLoading || isLoadError,
        hasChanges,
        onOpen,
        onClose,
        onConfirm,
        onSave,
    };
};
