import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    IWineOfferSaveResult,
    IWineOfferSummary,
    IWineOfferTarget,
} from '@/entities/wine/types/IOfferedWineListItem';
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { userModel } from '@/entities/users/UserModel';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { useUserCurrencies } from '@/UIKit/CurrencyPicker/presenters/useUserCurrencies';
import { useCurrencyPickerModal } from '@/UIKit/CurrencyPicker/presenters/useCurrencyPickerModal';

interface IProps {
    visible: boolean;
    wine: IWineOfferTarget | null;
    offer: IWineOfferSummary | null;
    onClose: () => void;
    onSaved: (result: IWineOfferSaveResult) => void;
    onDeleted: (wineId: number) => void;
    isWinery?: boolean;
}

const isValidWebsite = (value: string) => {
    if (!value) {
        return true;
    }

    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

export const useWineOfferModal = ({ visible, wine, offer, onClose, onSaved, onDeleted, isWinery = false }: IProps) => {
    const [price, setPrice] = useState(offer?.price === null || offer?.price === undefined ? '' : String(offer.price));
    const [currency, setCurrency] = useState(offer?.currency || userModel.user?.selectedCurrency || 'UAH');
    const [quantity, setQuantity] = useState(
        offer?.quantity === null || offer?.quantity === undefined ? '' : String(offer.quantity),
    );
    const [websiteUrl, setWebsiteUrl] = useState(offer?.websiteUrl || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { currencies, isCurrenciesLoading, onLoadCurrencies } = useUserCurrencies();

    useEffect(() => {
        if (!visible) {
            return;
        }

        onLoadCurrencies();
    }, [onLoadCurrencies, visible]);

    const onChangePrice = useCallback((value: string) => {
        setPrice(value.replace(',', '.'));
    }, []);

    const onChangeCurrency = useCallback((value: string) => {
        setCurrency(value);
    }, []);

    const onChangeQuantity = useCallback((value: string) => {
        setQuantity(value.replace(/[^0-9]/g, ''));
    }, []);

    const onChangeWebsiteUrl = useCallback((value: string) => {
        setWebsiteUrl(value);
    }, []);

    const normalizedPrice = Number(price);
    const isPriceValid = price.trim().length > 0 && Number.isFinite(normalizedPrice) && normalizedPrice > 0;
    const isQuantityValid = !quantity || Number.isInteger(Number(quantity));
    const isWebsiteUrlValid = isValidWebsite(websiteUrl.trim());
    const isBusy = isSaving || isDeleting;
    const isSaveDisabled = !wine || !currency || !isPriceValid || !isQuantityValid || (isWinery && !websiteUrl) || !isWebsiteUrlValid || isBusy;

    const currencyPicker = useCurrencyPickerModal({
        value: currency,
        currencies,
        onChange: onChangeCurrency,
        isDisabled: isBusy || isCurrenciesLoading || !currencies.length,
    });

    const onModalClose = useCallback(() => {
        if (!isBusy) {
            onClose();
        }
    }, [isBusy, onClose]);

    const onSave = useCallback(async () => {
        if (!wine || isSaveDisabled) {
            return;
        }

        setIsSaving(true);

        try {
            const trimmedWebsiteUrl = websiteUrl.trim();
            const parsedQuantity = quantity ? Number(quantity) : undefined;
            let saveResult: IWineOfferSaveResult;

            if (offer) {
                const response = await wineOfferService.update(offer.id, {
                    price: normalizedPrice,
                    currency,
                    quantity: parsedQuantity,
                    websiteUrl: trimmedWebsiteUrl || null,
                });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                saveResult = {
                    type: 'updated',
                    wineId: wine.id,
                    offer: response.data,
                };
            } else {
                const response = await wineOfferService.create({
                    wineId: wine.id,
                    price: normalizedPrice,
                    currency,
                    quantity: parsedQuantity,
                    websiteUrl: trimmedWebsiteUrl || undefined,
                });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                saveResult = {
                    type: 'created',
                    wine: response.data,
                };
            }

            toastService.showSuccess(
                localization.t('common.success'),
                localization.t(offer ? 'profile.wineOfferUpdated' : 'profile.wineOfferCreated'),
            );
            onSaved(saveResult);
        } catch (error) {
            console.error('useWineOfferModal -> onSave: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsSaving(false);
        }
    }, [currency, isSaveDisabled, normalizedPrice, offer, onSaved, quantity, websiteUrl, wine]);

    const onDelete = useCallback(async () => {
        if (!wine || !offer || isBusy) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await wineOfferService.delete(offer.id);
            if (response.isError || response.data?.success !== true) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            toastService.showSuccess(
                localization.t('common.success'),
                localization.t('profile.wineOfferDeleted'),
            );
            onDeleted(wine.id);
        } catch (error) {
            console.error('useWineOfferModal -> onDelete: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsDeleting(false);
        }
    }, [isBusy, offer, onDeleted, wine]);

    return useMemo(() => {
        return {
            price,
            currency,
            quantity,
            websiteUrl,
            isSaving,
            isDeleting,
            isSaveDisabled,
            isDeleteVisible: Boolean(offer),
            isDeleteDisabled: isSaving,
            isFormEditable: !isBusy,
            isCurrencyPickerDisabled: isBusy || isCurrenciesLoading || !currencies.length,
            isPriceError: Boolean(price) && !isPriceValid,
            isWebsiteUrlError: !isWebsiteUrlValid,
            modalTitle: localization.t(offer ? 'profile.editWinePrice' : 'profile.addWinePrice'),
            currencyPicker,
            onChangePrice,
            onChangeQuantity,
            onChangeWebsiteUrl,
            onModalClose,
            onSave,
            onDelete,
        };
    }, [
        currency,
        currencyPicker,
        currencies.length,
        isCurrenciesLoading,
        isBusy,
        isDeleting,
        isPriceValid,
        isSaveDisabled,
        isSaving,
        isWebsiteUrlValid,
        offer,
        onChangePrice,
        onChangeQuantity,
        onChangeWebsiteUrl,
        onModalClose,
        onDelete,
        onSave,
        price,
        quantity,
        websiteUrl,
    ]);
};
